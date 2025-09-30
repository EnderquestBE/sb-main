import { Plugin, PluginEvents } from "@serenityjs/plugins";
import { ActionForm, CustomEntityType, EntityHealthTrait, EntityHitSignal, LevelDBProvider, Player, PlayerBreakBlockSignal, PlayerChatSignal, PlayerInteractWithBlockSignal, PlayerJoinSignal, PlayerLeaveSignal, PlayerListTrait, PlayerOpenedContainerSignal, PlayerPlaceBlockSignal, WorldEvent, WorldInitializeSignal } from "@serenityjs/core";
import { ContainerType } from "@serenityjs/protocol";
import { IslandGenerator } from "./Classes/Island/generator";
import { ChatHandler } from "./Handlers/Chat/handler";
import { PermissionsHandler } from "./Handlers/Permissions/handler";
import { FlowingLiquidBlockTrait, LiquidInteractionBlockTrait, SourceLiquidBlockTrait, BlockFurnaceTrait, BlockCropTrait, BlockMultiBlockCropTrait, BlockStemCropTrait, BlockSpawnerTrait } from "./Traits/Block/traits";
import { EntityStackTrait, EntityPersistenceTrait, PlayerCommandCooldownTrait, PlayerListCustomTrait } from "./Traits/Entity/traits";
import { ItemSeedTrait, ItemHoeTrait, ItemSpawnerTrait, SealedTomeTrait } from "./Traits/Item/traits";
import { NametagHandler } from "./Handlers/Nametag/handler";
import { SpawnerHandler } from "./Handlers/Spawner/spawner";
import { BlockHandler } from "./Handlers/Block/handler";
import { PlayerEnum } from "./Classes/Command/Enums/player";
import { ServerTaskHandler } from "./Handlers/Server/handler";
import { PlayerExtension } from "./extensions/player";
import { CommandBuilder, CustomItemRegistry, DatabaseService, Island, IslandDatabase, ModerationDatabase, PlayerDatabase, Slapper, VendorDatabase, Warp } from "./Classes";
import { IslandPerkUnlocks } from "./Handlers/Island/perks";
import { Utils } from "./Utils/utils";
import { PlayerHud } from "./Handlers/Hud";
import { BoundaryHandler } from "./Handlers/Boundary/handler";
import { registerIslandHelpCommands } from "./Commands/Island/help";
import { Server } from "./server";
import { EntitySlapperTrait } from "./Traits/Entity/Slapper/slapper";
import { MorphManager } from "./Classes/Morph";
import { LeaderboardHandler } from "./Handlers/Leaderboard/handler";
import { BlockSpecialSignTrait } from "./Traits/Block/Sign/sign";
import { DiscordClient } from "./Discord";

/**
 * @IMPORTS
 */
import "./CustomEnchantments/enchantments"
import "./Handlers/Enchantment/handler"
import "./extensions/itemStack"
import "./extensions"

import "./Configuration/config"
import "./Configuration/Slapper/slapper"
import "./Configuration/Morph/morph"

import "./Commands/commands"
import "./Traits/Block/Liquid/liquidInteraction"
import { ModerationManager } from "./Classes/Data/Moderation";

class EnderquestPlugin extends Plugin implements PluginEvents {

  private readonly blockTraits = [
    LiquidInteractionBlockTrait,
    SourceLiquidBlockTrait,
    FlowingLiquidBlockTrait,
    BlockFurnaceTrait,
    BlockCropTrait,
    BlockMultiBlockCropTrait,
    BlockStemCropTrait,
    BlockSpawnerTrait,
    BlockSpecialSignTrait
  ];

  private readonly itemTraits = [
    ItemSeedTrait,
    ItemHoeTrait,
    ItemSpawnerTrait,
    SealedTomeTrait
  ]

  private readonly entityTraits = [
    EntityStackTrait,
    EntityPersistenceTrait
  ]

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
      BoundaryHandler.runtime(event)
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
    // Disconnect database.
    await this.database.disconnect();
    // Disconnect discord bot.
    await DiscordClient.disconnect();
    ServerTaskHandler.clearAllTasks();
    // Execute leave event.
    for (let player of this.serenity.getPlayers()) {
      this.onPlayerLeave({ player } as PlayerLeaveSignal)
    }
    // Mark server as stopped.
    this.logger.info("§5Ender§dquest§r has stopped safely.");
  }


  public beforePlayerJoin({ player }: PlayerJoinSignal): boolean {
    // Manage whitelist.
    if (!ModerationManager.instance.isWhitelisted(player)) return false;
    return true;
  }

  public async onPlayerJoin({ player }: PlayerJoinSignal): Promise<void> {
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
          LevelDBProvider.loadWorld(this.serenity, island.getWorldId())
        }
        if (island!.isOwner(player.xuid)) IslandPerkUnlocks.applyPermissions(player, island);
        this.logger.info(`Loaded island §e${islandName}§r into cache for ${player.username}.`);
      } else {
        this.logger.error(`§cFailed to load island data for ${player.username}.`)
      }
    }
    // Show chat join message.
    ChatHandler.onJoin(player, this.serenity)
    // Update nametag.
    NametagHandler.format(player)
    // Add username to player enum.
    PlayerEnum.options.push(player.username)
    // Increment player count.
    Server.incrementPlayerCount();
    // Custom palm model.
    if (player.username === "The Palm Healer") MorphManager.morph(player, "palm");
    // Show welcome form.
    ServerTaskHandler.queueTask(() => {
      const form = new ActionForm("Early Access");
      form.content = " \n       §l§eWelcome to §dEnderquest§e!§r§f\n\n  Thank you for your interest in this\n  server! Before you proceed, please\n    note that the server is still in\n development; features are incomplete\n       and you may lose progress.\n  If you encounter any issues, please\n         report them on Discord.\n\n   Thank you for your understanding!\n "
      form.button("Acknowledge");
      form.show(player);
    }, 3000);
  }

  public async onPlayerLeave({ player }: PlayerLeaveSignal): Promise<void> {
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
          Island.unload(islandName)
          const world = this.serenity.getWorld(island.getWorldId())
          if (world) {
            // Kick players still in the world, such as island visitors.
            const players = world.getPlayers()
            for (const survivor of players) {
              Warp.to(survivor, "SPAWN")
              survivor.info(`§cYou have been kicked from §e${island.getName()}§c: Island has gone offline.`)
            }
            // Unload island from storage.
            this.serenity.unregisterWorld(world)
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
    if (PlayerEnum.options.some((x) => x === player.username))
      PlayerEnum.options.splice(PlayerEnum.options.indexOf(player.username), 1)
    // Decrement player count.
    Server.decrementPlayerCount();
  }

  public onWorldInitialize({ world }: WorldInitializeSignal): void {
    // Register island block traits.
    world.entityPalette.unregisterTrait(PlayerListTrait)
    world.entityPalette.unregisterTrait(EntityHealthTrait)
    world.entityPalette.registerTrait(PlayerListCustomTrait)
    world.entityPalette.registerTrait(PlayerCommandCooldownTrait)
    world.entityPalette.registerTrait(EntitySlapperTrait)
    if (world.identifier.startsWith("sb_")) {
      // Register traits.
      for (let trait of this.blockTraits) {
        world.blockPalette.registerTrait(trait);
      }
      for (let trait of this.itemTraits) {
        world.itemPalette.registerTrait(trait)
      }
      for (let trait of this.entityTraits) {
        world.entityPalette.registerTrait(trait)
      }
      CustomItemRegistry.registerAll(world);
    }
    // Initialize hub slappers.
    if (world.identifier === "default") {
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
    return PermissionsHandler.onInteract(event)
  }

  public beforePlayerOpenedContainer(event: PlayerOpenedContainerSignal): boolean {
    if (event.container.type === ContainerType.Inventory) return true
    return PermissionsHandler.onUseContainer(event)
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
