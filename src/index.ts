import { Plugin, PluginEvents } from "@serenityjs/plugins";
import { EntityDimensionChangeSignal, PlayerChatSignal, PlayerJoinSignal, PlayerLeaveSignal } from "@serenityjs/core";
import { DisplaySlotType, ObjectiveSortOrder } from "@serenityjs/protocol";
import { IslandGenerator } from "./Classes/Island/generator";
import { Scorebar } from "./Scorebar/scorebar";
import { ChatHandler } from "./Classes/Chat/handler";
import { Server } from "./server";

class EnderquestPlugin extends Plugin implements PluginEvents {

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
  }

  public onPlayerLeave({ player }: PlayerLeaveSignal): void {
    Server.onPlayerLeave(player)
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
    return ChatHandler.onChat(event)
  }
}

export default new EnderquestPlugin();

/**
 * @IMPORTS
 */

import "./Commands/commands"