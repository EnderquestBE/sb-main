import { Plugin, PluginEvents } from "@serenityjs/plugins";
import { EntityDimensionChangeSignal, EntityHitSignal, PlayerBreakBlockSignal, PlayerChatSignal, PlayerContainerInteractionSignal, PlayerInteractWithBlockSignal, PlayerJoinSignal, PlayerLeaveSignal, PlayerPlaceBlockSignal, WorldInitializeSignal } from "@serenityjs/core";
import { DisplaySlotType, ObjectiveSortOrder } from "@serenityjs/protocol";
import { IslandGenerator } from "./Classes/Island/generator";
import { Scorebar } from "./Handlers/Scorebar/scorebar";
import { ChatHandler } from "./Handlers/Chat/handler";
import { PermissionsHandler } from "./Handlers/Permissions/handler";
import { FlowingLiquidBlockTrait, LiquidInteractionBlockTrait, SourceLiquidBlockTrait } from "./BlockTraits/traits";
import { Server } from "./server";

class EnderquestPlugin extends Plugin implements PluginEvents {

  private readonly blockTraits = [
    LiquidInteractionBlockTrait,
    SourceLiquidBlockTrait,
    FlowingLiquidBlockTrait,
  ];

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
  }

  public onPlayerLeave({ player }: PlayerLeaveSignal): void {
    Server.onPlayerLeave(player)
    ChatHandler.onLeave(player, this.serenity)
  }

  public onWorldInitialize({ world }: WorldInitializeSignal): void {
    // Register island block traits.
    if (world.identifier.startsWith("sb_")) {
      for (let trait of this.blockTraits) {
        world.blockPalette.registerTrait(trait);
      }
    }
  }

  public onEntityDimensionChange?({ entity, fromDimension, toDimension }: EntityDimensionChangeSignal): void {
    if (!entity.isPlayer()) return
    if (entity.getSetting("hudMode") === "scoreboard") {
      const objective = fromDimension.world.scoreboard.getObjective(`sbs_${entity.xuid}`)
      if (objective) {
        fromDimension.world.scoreboard.removeObjective(objective)
        fromDimension.world.scoreboard.clearObjectiveAtDisplaySlot(DisplaySlotType.Sidebar, { player: entity, objective: objective, sortOrder: ObjectiveSortOrder.Ascending })
      }
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

  public beforePlayerContainerInteraction(event: PlayerContainerInteractionSignal): boolean {
    return PermissionsHandler.onUseContainer(event)
  }

  public beforeEntityHit(event: EntityHitSignal): boolean {
    return PermissionsHandler.onEntityHit(event)
  }
}

export default new EnderquestPlugin();

/**
 * @IMPORTS
 */

import "./Commands/commands"
import "./BlockTraits/Liquid/liquidInteraction"
import { NametagHandler } from "./Handlers/Nametag/handler";