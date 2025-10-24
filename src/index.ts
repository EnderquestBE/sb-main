import { Plugin, PluginEvents } from "@serenityjs/plugins";
import { ActionForm, CustomEntityType, EntityDimensionChangeSignal, EntityHealthTrait, EntityHitSignal, EntitySpawnedSignal, Player, PlayerBreakBlockSignal, PlayerChatSignal, PlayerInteractWithBlockSignal, PlayerJoinSignal, PlayerLeaveSignal, PlayerLevelingTrait, PlayerOpenedContainerSignal, PlayerPlaceBlockSignal, WorldEvent, WorldInitializeSignal } from "@serenityjs/core";
import { BlockHandler, ChatHandler, IslandPerkUnlocks, LeaderboardHandler, NametagHandler, PermissionsHandler, PlayerHud, ServerTaskHandler, SpawnerHandler, HologramHandler } from "./Handlers";
import { IslandGenerator } from "./Classes/Island/generator";
import { PlayerEnum } from "./Classes/Command/Enums/player";
import { PlayerExtension } from "./extensions/player";
import { CommandBuilder, CustomItemRegistry, DatabaseService, Island, IslandDatabase, PlayerDatabase, Slapper, VendorDatabase, Warp, IslandProvider, PremiumDatabase, GlobalDatabase, GlobalDataManager } from "./Classes";
import { Utils } from "./Utils/utils";
import { registerIslandHelpCommands } from "./Commands/Island/help";
import { Server } from "./server";
import { EntitySlapperTrait } from "./Traits/Entity/Slapper/slapper";
import { MorphManager } from "./Classes/Morph";
import { DiscordClient } from "./Discord";
import { resolve } from "node:path";
import { BlockTraits, ItemTraits, EntityTraits } from "./Traits";
import { PlayerCommandCooldownTrait, PlayerListCustomTrait } from "./Traits/Entity/Player";
import { EntityStackTrait } from "./Traits/Entity/traits";
import { ContainerType, DataPacket, PlayerSkinPacket } from "@serenityjs/protocol";
import { EntityPersistenceTrait } from "./Traits/Entity/Persistence/persistence";
import { PlayerBoundaryTrait } from "./Traits/Entity/Boundary/boundary";
import { EntityClientRenderTrait } from "./Traits/Entity/Slapper/clientRender";
import { DEFAULT_PLAYER_DATA, DEFAULT_PREMIUM_DATA, STAFF_PERMISSIONS } from "./Configuration/config";
import { isDevEnvironment } from "./config";
import { BlockTileEntityUpdateTrait } from "./Traits/Block/traits";
import { EntityItemHandlerTrait } from "./Traits/Entity/Persistence/item";

/**
 * @IMPORTS
 */
import "./config"
import "./Utils/logger"
import "./Utils/backups"
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

class EnderquestPlugin extends Plugin implements PluginEvents {

  private database!: DatabaseService;

  public constructor() {
    super("enderquest", "0.0.1+indev");
  }

  public onInitialize(): void {
    this.database = new DatabaseService()
    // Register database.
    this.registerDBService()
    // Register island world provider.
    this.serenity.registerProvider(IslandProvider, { path: "./islands" })
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
    new PremiumDatabase(this.database);
    new IslandDatabase(this.database);
    new VendorDatabase(this.database);
    new GlobalDatabase(this.database);
    // Initialize leaderboards.
    LeaderboardHandler.initialize(this.serenity.getWorld());
    // Initialize holograms.
    HologramHandler.initialize(this.serenity.getWorld());
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
      // Update premium data.
      const premiumData = await PremiumDatabase.instance.getByXUID(player.xuid);
      if (!premiumData) {
        await PremiumDatabase.instance.create({
          ...DEFAULT_PREMIUM_DATA
        });
      } else {
        let premiumUpdated = false;
        for (const key of Object.keys(DEFAULT_PREMIUM_DATA)) {
          if ((premiumData as any)[key] === undefined) {
            (premiumData as any)[key] = (DEFAULT_PREMIUM_DATA as any)[key];
            premiumUpdated = true;
          }
        }
        if (premiumUpdated) {
          await PremiumDatabase.instance.update(premiumData!.xuid, premiumData!);
        }
      }
    }
  }

  public onStartUp(): void {
    // Set server serenity instance.
    Server.initialize(this.serenity);
    // Register island world generator.
    this.serenity.registerGenerator(IslandGenerator);
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
    if (!GlobalDataManager.instance.isWhitelisted(player)) {
      player.disconnect("§cThe server is currently closed for play testing.\n§dIf you are interested, join our discord:\n§9https://discord.ender.quest")
      return false;
    }
    return true;
  }

  public async onPlayerJoin({ player }: PlayerJoinSignal): Promise<void> {
    // Custom developer code.
    if (player.username === "The Palm Healer") {
      //@ts-ignore
      if (isDevEnvironment) player._commandCooldown = true;
      else MorphManager.morph(player, "palm");
    }
    // Load player data.
    const session = await PlayerExtension.loadSession(player);
    if (!session) {
      await PlayerExtension.createSession(player);
      this.logger.info(`Created new session for player ${player.username}.`);
    } else {
      player.updateUsername();
      this.logger.info(`Loaded session for player ${player.username}.`);
    }

    // Reload player rank permissions.
    player.permissions.permissions.filter((x) => !x.startsWith("rank."));

    // Load island into cache
    const islandName = player.getIslandName();
    if (islandName) {
      // Load island
      const island = await Island.load(islandName);
      if (island) {
        // Load island world from storage.
        if (island.getOnlineOwners().length <= 1) {
          //@ts-ignore
          const world = await IslandProvider.loadWorld(this.serenity, island.getWorldPath());
          if (!world) {
            player.disconnect("§cFailed to join. Please try again later.");
            return;
          }
        }
        // Update island perks permissions.
        if (island!.isOwner(player.xuid)) IslandPerkUnlocks.applyPermissions(player, island);
        this.logger.info(`Loaded island §e${islandName}§r into cache for ${player.username}.`);
      } else {
        this.logger.error(`§cFailed to load island data for ${player.username}.`)
      }
    }
    // Apply staff permissions.
    const permissionInt = player.getPermission();
    const permissions = STAFF_PERMISSIONS.get(permissionInt);
    if (permissions && permissions.length > 0) {
      for (const perm of permissions) {
        player.addPermission(perm);
      }
    }
    // Update rank permissions.
    player.updateRanks();
    // Disable flight if active from previous session.
    player.disableFlight();
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
      form.show(player, (_result, _error) => {
        // Load vanity data.
        if (player)
          player.updateVanity();
      });
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
    world.entityPalette.registerTrait(EntityItemHandlerTrait)
    world.entityPalette.registerTrait(EntityClientRenderTrait)
    // Register global item traits.
    for (const trait of EntityTraits) {
      world.entityPalette.registerTrait(trait)
    }
    for (const trait of ItemTraits) {
      world.itemPalette.registerTrait(trait)
    }
    if (world.identifier.startsWith("sb_")) {
      // Register island block and entity traits.
      for (const trait of BlockTraits) {
        world.blockPalette.registerTrait(trait);
      }
      // Register custom item types.
      CustomItemRegistry.registerAll(world);
    }
    // Initialize hub slappers.
    if (world.identifier === "default") {
      // Register global custom item types.
      CustomItemRegistry.registerDefault(world);
      ServerTaskHandler.queueTask(() => {
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
    if (event.itemStack?.hasDynamicProperty("bypassInteract")) {
      if (event.itemStack.traits?.size > 0) {
        for (const trait of event.itemStack.traits.values()) {
          //@ts-ignore
          trait.onUseOnBlock?.(event.source, { targetBlock: event.block })
        }
      }
      return false;
    }
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

  // Fix for rendering update for tile entities (chests).
  public afterEntityDimensionChange({ toDimension, entity: player }: EntityDimensionChangeSignal) {
    if (!(player instanceof Player)) return;

    // Handle updating tile entities in new dimension.
    if (toDimension.world.identifier.startsWith("sb_")) {
      // Create a list of update packets.
      const packets: DataPacket[] = [];

      // Get the blocks in the dimension.
      const blocks = toDimension.blocks.values().filter((x) => x.hasTrait(BlockTileEntityUpdateTrait));

      // Iterate through blocks that have the container update trait.
      for (const block of blocks) {
        packets.push(...block.getTrait(BlockTileEntityUpdateTrait).updateTileEntity());
      }

      // Send the update packets.
      ServerTaskHandler.queueTask(() => {
        if (packets.length > 0) player.send(...packets);
      }, 100);
    }

    // Handle updating skins of players in the new dimension for the joining player.

    // Get vanity skin cache.
    //@ts-ignore
    const skins: { [key: string]: string } = player.vanitySkinCache;
    //@ts-ignore
    if (!skins) player.vanitySkinCache = {};

    // Iterate through players in the dimension.
    for (const p of toDimension.getPlayers()) {
      if (p.xuid === player.xuid) continue;
      // Check if the player has cached their vanity skin.
      const cachedId = skins[p.uuid];
      //@ts-ignore
      if (cachedId !== p.skin.identifier) {
        // Update vanity skin cache.
        //@ts-ignore
        player.vanitySkinCache[p.uuid] = p.skin.identifier;

        // Send skin update packet.
        const packet = new PlayerSkinPacket();
        packet.uuid = p.uuid;
        //@ts-ignore
        packet.skin = p.vanitySkin ?? p.skin.getSerialized();
        //@ts-ignore
        packet.skinName = p.vanitySkin.identifier ?? p.skin.identifier;
        //@ts-ignore
        packet.oldSkinName = cachedId ?? p.skin.identifier;
        packet.isVerified = true;

        player.send(packet);
      }
    }

    // Handle updating the player's skin to others in the new dimension.
    // Send skin update packet.
    const packet = new PlayerSkinPacket();
    packet.uuid = player.uuid;
    //@ts-ignore
    packet.skin = player.vanitySkin ?? player.skin.getSerialized();
    //@ts-ignore
    packet.skinName = player.vanitySkin.identifier ?? player.skin.identifier;
    //@ts-ignore
    packet.oldSkinName = player.skin.identifier;
    packet.isVerified = true;

    toDimension.broadcast(packet);
  }
}

export default new EnderquestPlugin();
