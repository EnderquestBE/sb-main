import { Plugin, PluginEvents } from "@serenityjs/plugins";
import { EntityDimensionChangeSignal, EntityHealthTrait, EntityHitSignal, PlayerBreakBlockSignal, PlayerChatSignal, PlayerInteractWithBlockSignal, PlayerJoinSignal, PlayerLeaveSignal, PlayerOpenedContainerSignal, PlayerPlaceBlockSignal, WorldInitializeSignal } from "@serenityjs/core";
import { ContainerType, DisplaySlotType, ObjectiveSortOrder } from "@serenityjs/protocol";
import { IslandGenerator } from "./Classes/Island/generator";
import { Scorebar } from "./Handlers/Scorebar/scorebar";
import { ChatHandler } from "./Handlers/Chat/handler";
import { PermissionsHandler } from "./Handlers/Permissions/handler";
import { FlowingLiquidBlockTrait, LiquidInteractionBlockTrait, SourceLiquidBlockTrait, BlockFurnaceTrait, BlockCropTrait, BlockMultiBlockCropTrait, BlockStemCropTrait, BlockSpawnerTrait } from "./Traits/Block/traits";
import { EntityStackTrait, EntityPersistenceTrait, PlayerCommandCooldownTrait } from "./Traits/Entity/traits";
import { ItemSeedTrait, ItemHoeTrait, ItemSpawnerTrait, SealedTomeTrait } from "./Traits/Item/traits";
import { NametagHandler } from "./Handlers/Nametag/handler";
import { SpawnerHandler } from "./Handlers/Spawner/spawner";
import { BlockHandler } from "./Handlers/Block/handler";
import { SignHandler } from "./Handlers/Sign/handler";
import { PlayerEnum } from "./Classes/Command/Enums/player";
import { Server } from "./server";

/**
 * @IMPORTS
 */
import "./Handlers/Enchantment/handler"
import "./extensions/itemStack"
import "./extensions/equipment"
import "./extensions/player"
import "./extensions/world"
import "./extensions/inventory"

import "./Configuration/config"
import "./CustomEnchantments/enchantments"

import "./Commands/commands"
import "./Traits/Block/Liquid/liquidInteraction"
import { ServerTaskHandler } from "./Handlers/Server/handler";


class EnderquestPlugin extends Plugin implements PluginEvents {

  private readonly blockTraits = [
    LiquidInteractionBlockTrait,
    SourceLiquidBlockTrait,
    FlowingLiquidBlockTrait,
    BlockFurnaceTrait,
    BlockCropTrait,
    BlockMultiBlockCropTrait,
    BlockStemCropTrait,
    BlockSpawnerTrait
  ];

  private readonly itemTraits = [
    ItemSeedTrait,
    ItemHoeTrait,
    ItemSpawnerTrait,
    SealedTomeTrait
  ]

  private readonly entityTraits = [
    EntityStackTrait,
    PlayerCommandCooldownTrait,
    EntityPersistenceTrait
  ]

  public constructor() {
    super("enderquest", "0.0.1+indev");
  }

  public onInitialize(): void {
    Server.initialize(this.serenity)
  }

  public onStartUp(): void {
    Server.onStartUp()
    // Register island world generator.
    this.serenity.registerGenerator(IslandGenerator)
    IslandGenerator.registerStructure(this.serenity.getWorld())
    ServerTaskHandler.initialize(this.serenity)
    BlockHandler.initialize()
    SpawnerHandler.initialize()
    this.logger.info("§5Ender§dquest§r has started.");
  }

  public onShutDown(): void {
    Server.onShutDown()
    this.logger.info("§5Ender§dquest§r has stopped safely.");
  }

  public onPlayerJoin({ player }: PlayerJoinSignal): void {
    Server.onPlayerJoin(player)
    ChatHandler.onJoin(player, this.serenity)
    NametagHandler.format(player)
    PlayerEnum.options.push(player.username)
  }

  public onPlayerLeave({ player }: PlayerLeaveSignal): void {
    // Stop whileOnEquipped check
    for (const key of Object.keys(player.whileEquippedCheck) as unknown[] as (keyof typeof player.whileEquippedCheck)[]) {
      if (player.whileEquippedCheck[key]) {
        clearTimeout(player.whileEquippedCheck[key]!);
        player.whileEquippedCheck[key] = null;
      }
    }
    Server.onPlayerLeave(player)
    ChatHandler.onLeave(player, this.serenity)
    if (PlayerEnum.options.some((x) => x === player.username))
      PlayerEnum.options.splice(PlayerEnum.options.indexOf(player.username), 1)
  }

  public onWorldInitialize({ world }: WorldInitializeSignal): void {
    // Register island block traits.
    if (world.identifier.startsWith("sb_")) {
      world.entityPalette.unregisterTrait(EntityHealthTrait)
      for (let trait of this.blockTraits) {
        world.blockPalette.registerTrait(trait);
      }
      for (let trait of this.itemTraits) {
        world.itemPalette.registerTrait(trait)
      }
      for (let trait of this.entityTraits) {
        world.entityPalette.registerTrait(trait)
      }
    }
  }

  public beforeEntityDimensionChange({ entity, fromDimension }: EntityDimensionChangeSignal): boolean {
    if (!entity.isPlayer()) return true
    if (entity.getSetting("hudMode") === "scoreboard") {
      const objective = fromDimension.world.scoreboard.getObjective(`sbs_${entity.xuid}`)
      if (objective) {
        fromDimension.world.scoreboard.removeObjective(objective)
        fromDimension.world.scoreboard.clearObjectiveAtDisplaySlot(DisplaySlotType.Sidebar, { player: entity, objective: objective, sortOrder: ObjectiveSortOrder.Ascending })
      }
    }
    return true
  }

  public afterEntityDimensionChange({ entity, toDimension }: EntityDimensionChangeSignal): void {
    if (!entity.isPlayer()) return
    if (entity.getSetting("hudMode") === "scoreboard") {
      Scorebar.initialize(entity, toDimension.world)
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
    return PermissionsHandler.onEntityHit(event)
  }

  // Point events.

  public onPlayerBreakBlock(event: PlayerBreakBlockSignal): void {
    BlockHandler.onBreak(event)
  }

  public afterPlayerPlaceBlock(event: PlayerPlaceBlockSignal): void {
    BlockHandler.onPlace(event)
  }

  public afterPlayerInteractWithBlock(event: PlayerInteractWithBlockSignal): void {
    SignHandler.onInteract(event)
  }

  public afterEntityHit(event: EntityHitSignal): void {
    if (event.hitEntity.hasTrait(EntityStackTrait)) {
      (event.hitEntity.getTrait(EntityStackTrait) as EntityStackTrait).onDamage(event.damagingEntity)
    }
  }

}

export default new EnderquestPlugin();
