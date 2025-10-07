import { Plugin, PluginEvents } from "@serenityjs/plugins";
import { ActionForm, CustomEntityType, EntityHealthTrait, EntityHitSignal, EntitySpawnedSignal, LevelDBProvider, Player, PlayerBreakBlockSignal, PlayerChatSignal, PlayerInteractWithBlockSignal, PlayerJoinSignal, PlayerLeaveSignal, PlayerLevelingTrait, PlayerOpenedContainerSignal, PlayerPlaceBlockSignal, WorldEvent, WorldInitializeSignal } from "@serenityjs/core";
import { BlockHandler, ChatHandler, IslandPerkUnlocks, LeaderboardHandler, NametagHandler, PermissionsHandler, PlayerHud, ServerTaskHandler, SpawnerHandler, HologramHandler } from "./Handlers";
import { IslandGenerator } from "./Classes/Island/generator";
import { PlayerEnum } from "./Classes/Command/Enums/player";
import { PlayerExtension } from "./extensions/player";
import { CommandBuilder, CustomItemRegistry, DatabaseService, Island, IslandDatabase, ModerationDatabase, PlayerDatabase, Slapper, VendorDatabase, Warp } from "./Classes";
import { Utils } from "./Utils/utils";
import { registerIslandHelpCommands } from "./Commands/Island/help";
import { Server } from "./server";
import { EntitySlapperTrait } from "./Traits/Entity/Slapper/slapper";
import { MorphManager } from "./Classes/Morph";
import { DiscordClient } from "./Discord";
import { ModerationManager } from "./Classes/Data/Moderation";
import { resolve } from "node:path";
import { rmdir } from "node:fs/promises";
import { BlockTraits, ItemTraits, EntityTraits } from "./Traits";
import { PlayerCommandCooldownTrait, PlayerListCustomTrait } from "./Traits/Entity/Player";
import { EntityStackTrait } from "./Traits/Entity/traits";
import { ContainerType } from "@serenityjs/protocol";
import { EntityPersistenceTrait } from "./Traits/Entity/Persistence/persistence";
import { PlayerBoundaryTrait } from "./Traits/Entity/Boundary/boundary";

/**
 * @IMPORTS
 */
import "./Traits"
import "./Classes/Items/itemRegistry";
import "./CustomEnchantments/enchantments"
import "./Handlers/Enchantment/handler"
import "./extensions/itemStack"
import "./extensions"

import "./Configuration/config"
import "./Configuration/Slapper/slapper"
import "./Configuration/Morph/morph"

import "./Commands/commands"
import "./Traits/Block/Liquid/liquidInteraction"
import { EntityClientRenderTrait } from "./Traits/Entity/Slapper/clientRender";
import { DEFAULT_PLAYER_DATA, STAFF_PERMISSIONS } from "./Configuration/config";

const envArg = process.argv.find(arg => arg.startsWith('--env='));
const isDevEnvironment = envArg === '--env=development';

export { isDevEnvironment }

class EnderquestPlugin extends Plugin implements PluginEvents {

  private database!: DatabaseService;

  public constructor() {
    super("enderquest", "0.0.1+indev");
  }

  public onInitialize(): void {
    this.database = new DatabaseService()
    // Register database.
    this.registerDBService()
    // Register warp locations and commands.
    Warp.registerAll()
    // Register commands.
    CommandBuilder.registerAll(this.serenity.commandPalette);
    // Register island command helper.
    registerIslandHelpCommands(this.serenity.commandPalette.commands.get("island")!.registry.overloads.keys().map((x) => {
      const parameters = Object.keys(x)
      return {
        //@ts-ignore
        name: x[parameters[0]!].identifier.substring(6).toLowerCase(), params: parameters.slice(1).map((p) => {
          const arg = x[p]!
          if (Array.isArray(arg)) return { type: arg[0].identifier, name: p, optional: arg[1] }
          else return { type: arg.identifier, name: Utils.formatString(p), optional: false }
        })
      }
    }).toArray().sort((a, b) => a.name.localeCompare(b.name)));
    // Start hud runtime.
    this.serenity.on(WorldEvent.WorldTick, async (event) => {
      PlayerHud.runtime(event)
    })
  }

  private async registerDBService() {
    await this.database.connect();
    new PlayerDatabase(this.database);
    new IslandDatabase(this.database);
    new VendorDatabase(this.database);
    new ModerationDatabase(this.database);
    // Initialize leaderboards.
    LeaderboardHandler.initialize(this.serenity.getWorld());
    // Initialize holograms.
    HologramHandler.initialize(this.serenity.getWorld());
    // Delete developer data.
    if (isDevEnvironment) {
      await PlayerDatabase.instance.delete("0000000000000000");
    }
    // Update missing player data properties if applicable.
    const players = await PlayerDatabase.instance.collection.find({}).toArray() as any[];
    for (const player of players) {
      let updated = false;
      for (const key of Object.keys(DEFAULT_PLAYER_DATA)) {
        if (player[key] === undefined) {
          (player as any)[key] = (DEFAULT_PLAYER_DATA as any)[key];
          updated = true;
        }
      }
      if (updated) {
        await PlayerDatabase.instance.update(player.xuid, player);
      }
    }
  }

  public onStartUp(): void {
    // Set server serenity instance.
    Server.initialize(this.serenity);
    // Register island world generator.
    this.serenity.registerGenerator(IslandGenerator)
    IslandGenerator.registerStructure(this.serenity.getWorld())
    // Start server tasks.
    ServerTaskHandler.initialize(this.serenity)
    // Initialize handlers.
    BlockHandler.initialize()
    SpawnerHandler.initialize()
    // Initialize discord bot.
    DiscordClient.initialize();
    // Mark server as started.
    this.logger.info("§5Ender§dquest§r has started.");
  }

  public async onShutDown(): Promise<void> {
    // Allow time for player disconnection and other ongoing processes.
    while (this.serenity.players.size > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    // Disconnect database.
    await this.database.disconnect();
    // Disconnect discord bot.
    await DiscordClient.disconnect();
    ServerTaskHandler.clearAllTasks();
    // Mark server as stopped.
    this.logger.info("§5Ender§dquest§r has stopped safely.");
    resolve();
    process.exit(0);
  }


  public beforePlayerJoin({ player }: PlayerJoinSignal): boolean {
    // Manage whitelist.
    if (!ModerationManager.instance.isWhitelisted(player)) {
      player.disconnect("§cThe server is currently closed for play testing.\n§dIf you are interested, join our discord:\n§9https://discord.ender.quest")
      return false;
    }
    return true;
  }

  public async onPlayerJoin({ player }: PlayerJoinSignal): Promise<void> {
    // Custom developer code.
    if (player.username === "The Palm Healer") {
      MorphManager.morph(player, "palm");
      if (isDevEnvironment) {
        //@ts-ignore
        player.xuid = "0000000000000000";
      }
    }
    // Load player data.
    const session = await PlayerExtension.loadSession(player);
    if (!session) {
      await PlayerExtension.createSession(player);
      this.logger.info(`Created new session for player ${player.username}.`);
    } else {
      this.logger.info(`Loaded session for player ${player.username}.`);
    }

    // Load island into cache
    const islandName = player.getIslandName();
    if (islandName) {
      // Load island
      const island = await Island.load(islandName);
      if (island) {
        // Load island world from storage.
        if (island.getOnlineOwners().length <= 1) {
          //@ts-ignore
          const world = await LevelDBProvider.loadWorld(this.serenity, island.getWorldId());
          if (!world) {
            player.disconnect("§cFailed to join. Please try again later.");
            return;
          }
        }
        if (island!.isOwner(player.xuid)) IslandPerkUnlocks.applyPermissions(player, island);
        this.logger.info(`Loaded island §e${islandName}§r into cache for ${player.username}.`);
      } else {
        this.logger.error(`§cFailed to load island data for ${player.username}.`)
      }
    }
    // Apply staff permissions.
    const permissionInt = isDevEnvironment ? 5 : player.getPermission();
    const permissions = STAFF_PERMISSIONS.get(permissionInt);
    console.log(permissionInt)
    if (permissions && permissions.length > 0) {
      for (const perm of permissions) {
        player.addPermission(perm);
      }
    }
    // Show chat join message.
    ChatHandler.onJoin(player, this.serenity)
    // Update nametag.
    NametagHandler.format(player)
    // Add username to player enum.
    PlayerEnum.update(this.serenity);
    // Update player count.
    Server.updatePlayerCount();
    // Show welcome form.
    ServerTaskHandler.queueTask(() => {
      const form = new ActionForm("Early Access");
      form.content = " \n       §l§eWelcome to §dEnderquest§e!§r§f\n\n  Thank you for your interest in this\n  server! Before you proceed, please\n    note that the server is still in\n development; features are incomplete\n       and you may lose progress.\n  If you encounter any issues, please\n         report them on Discord.\n\n   Thank you for your understanding!\n "
      form.button("Acknowledge");
      form.show(player);
    }, 3000);
    resolve();
  }

  public onEntitySpawned(event: EntitySpawnedSignal): void {
    if (!event.initialSpawn || !(event.entity instanceof Player)) return;
    const player = event.entity;
    // Update XP.
    const leveling = player.getTrait(PlayerLevelingTrait) ?? player.addTrait(PlayerLevelingTrait)
    leveling.setExperience(player.getXp());
  }

  public async onPlayerLeave({ player }: PlayerLeaveSignal): Promise<void> {
    try {
      // Stop whileOnEquipped check
      for (const key of Object.keys(player.whileEquippedCheck) as unknown[] as (keyof typeof player.whileEquippedCheck)[]) {
        if (player.whileEquippedCheck[key]) {
          clearTimeout(player.whileEquippedCheck[key]!);
          player.whileEquippedCheck[key] = null;
        }
      }
      // Unload island if no owners are online.
      const islandName = player.getIslandName();
      if (islandName) {
        const island = await Island.load(islandName);
        if (island) {
          const worldId = island.getWorldId();
          if (island.getOnlineOwners().length === 0) {
            // Unload island.
            const world = island.getWorld();
            Island.unload(islandName);
            if (world) {
              // Kick players still in the world, such as island visitors.
              const players = world.getPlayers();
              for (const survivor of players) {
                Warp.to(survivor, "SPAWN");
                survivor.info(`§cYou have been kicked from §e${island.getName()}§c: Island has gone offline.`);
              }
              // Unload island from storage.
              this.serenity.unregisterWorld(world);
            }
          }
          if (player.username === "The Palm Healer" && isDevEnvironment) {
            // Remove developer data.
            await IslandDatabase.instance.delete(islandName);
            this.serenity.worlds.delete(worldId)
            rmdir(resolve(`./worlds/${worldId}`), { recursive: true })
          }
          this.logger.info(`Unloaded island §e${islandName}§r from cache.`)
        }
      }
      // Uncache player data.
      player.setTimePlayed(player.getTimePlayed())
      PlayerExtension.removeSession(player);
      this.logger.info(`Removed session for player ${player.username}.`);
      // Show chat leave message.
      ChatHandler.onLeave(player, this.serenity)
      // Remove username from player enum.
      PlayerEnum.update(this.serenity);
      // Update player count.
      Server.updatePlayerCount();
      resolve();
    } catch (e) { }
  }

  public onWorldInitialize({ world }: WorldInitializeSignal): void {
    // Register global player traits.
    world.entityPalette.registerTrait(PlayerListCustomTrait)
    world.entityPalette.registerTrait(PlayerCommandCooldownTrait)
    world.entityPalette.registerTrait(PlayerBoundaryTrait);
    // Register global entity traits.
    world.entityPalette.unregisterTrait(EntityHealthTrait)
    world.entityPalette.registerTrait(EntitySlapperTrait)
    world.entityPalette.registerTrait(EntityPersistenceTrait)
    world.entityPalette.registerTrait(EntityClientRenderTrait)
    // Register global item traits.
    for (let trait of EntityTraits) {
      world.entityPalette.registerTrait(trait)
    }
    if (world.identifier.startsWith("sb_")) {
      // Register island block and entity traits.
      for (let trait of BlockTraits) {
        world.blockPalette.registerTrait(trait);
      }
      for (let trait of ItemTraits) {
        world.itemPalette.registerTrait(trait)
      }
      // Register custom item types.
      CustomItemRegistry.registerAll(world);
    }
    // Initialize hub slappers.
    if (world.identifier === "default") {
      // Register global custom item types.
      CustomItemRegistry.registerDefault(world);
      setTimeout(() => {
        // Initialize slappers.
        const slappers = Slapper.getAll()
        for (const slapper of slappers) {
          // Register type.
          const type = new CustomEntityType(slapper.identifier)
          world.entityPalette.registerType(type)
          // Spawn entity.
          const dimension = world.getDimension()
          const entity = dimension.spawnEntity(type, slapper.position, false)
          if (slapper.rotation) {
            entity.setRotation(slapper.rotation)
          }
          entity.setGravityForce(0)
          entity.addTrait(EntitySlapperTrait)
          entity.spawn();
        }
      }, 3000);
    }
  }

  public beforePlayerChat(event: PlayerChatSignal): boolean {
    return ChatHandler.onChat(event, this.serenity)
  }

  // World permissions events.

  public beforePlayerBreakBlock(event: PlayerBreakBlockSignal): boolean {
    return PermissionsHandler.onBreak(event)
  }

  public beforePlayerPlaceBlock(event: PlayerPlaceBlockSignal): boolean {
    return PermissionsHandler.onPlace(event)
  }

  public beforePlayerInteractWithBlock(event: PlayerInteractWithBlockSignal): boolean {
    if (event.itemStack?.hasDynamicProperty("bypassInteract")) return true;
    return PermissionsHandler.onInteract(event);
  }

  public beforePlayerOpenedContainer(event: PlayerOpenedContainerSignal): boolean {
    if (event.container.type === ContainerType.Inventory) return true;
    else return PermissionsHandler.onContainerOpen(event);
  }

  public beforeEntityHit(event: EntityHitSignal): boolean {
    if (event.hitEntity.hasTrait(EntitySlapperTrait)) {
      event.hitEntity.getTrait(EntitySlapperTrait)!.slapperInteract(event.damagingEntity as Player)
      return false
    } else return PermissionsHandler.onEntityHit(event)
  }

  // Point events.

  public onPlayerBreakBlock({ player, block, itemStack }: PlayerBreakBlockSignal): void {
    BlockHandler.onBreak(player, itemStack, block)
  }

  public afterPlayerPlaceBlock(event: PlayerPlaceBlockSignal): void {
    BlockHandler.onPlace(event)
  }

  public afterEntityHit(event: EntityHitSignal): void {
    if (event.hitEntity.hasTrait(EntityStackTrait)) {
      (event.hitEntity.getTrait(EntityStackTrait) as EntityStackTrait).onDamage(event.damagingEntity)
    }
  }

}

export default new EnderquestPlugin();
