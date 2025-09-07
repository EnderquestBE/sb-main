import { Player, Serenity, World, WorldEvent } from "@serenityjs/core";
import { DisplaySlotType, ObjectiveSortOrder } from "@serenityjs/protocol";
import { Server } from "../server";
import { Utils } from "../Utils/utils";

class Scorebar {
    public static runtime(serenity: Serenity) {
        serenity.on(WorldEvent.WorldTick, ({ currentTick, world }) => {
            if (Number(currentTick) % 20 !== 0) return
            for (let player of world.getPlayers()) {
                this.update(player, world)
            }
        })
    }

    public static initialize(player: Player, world: World) {
        const scoreboard = world.scoreboard
        let objective = scoreboard.getObjective(`sbs_${player.xuid}`)
        objective ??= scoreboard.addObjective(`sbs_${player.xuid}`, "§l§dEnder§5Quest")
        scoreboard.setObjectiveAtDisplaySlot(DisplaySlotType.Sidebar, { objective: objective, player: player, sortOrder: ObjectiveSortOrder.Ascending })
    }

    private static update(player: Player, world: World) {
        const scoreboard = world.scoreboard
        const objective = scoreboard.getObjective(`sbs_${player.xuid}`)
        if (!objective) {
            Server.logger.warn(`§6Player §e${player.username} §6is missing their scoreboard display.`)
            return Scorebar.initialize(player, world)
        }
        objective.clearScores()
        let i = 0
        function addScore(str: string) {
            objective!.setScore(str, i++)
        }
        addScore(`§d➲ §aUser: §f${player.username}`);
        addScore(`§d➲ §ePlayers: §f${world.getPlayers().length}§7/§f${20}`);
        addScore(`§d➲ §3Ping: §f${0}§7/§f${20}`);
        addScore(`§d➲ §6Money: §f$${player.getMoney()}`);
        addScore(`§d➲ §dShards: §f${player.getShards() + Math.floor(Math.random() * 10)}`);
        addScore(`§b❖ Your Stats ❖`);
        addScore(` §b匚 §aRank: §f${"Guest"}`);
        addScore(` §b匚 §2Island: §f${player.getIslandName() === "" ? "§e/is create" : player.getIslandName()}`);
        addScore(` §b匚 §eLevel: §f${14}`);
        addScore(` §b匚 §6Time: §f${Utils.formatDuration(player.getTimePlayed())}`);
        addScore(` §b匚 §cKills: §f0 §9Deaths: §f0`);
        addScore(`§d➤ §7Use §6/hud §7to disable.`);
        scoreboard.setObjectiveAtDisplaySlot(DisplaySlotType.Sidebar, { objective: objective, player: player, sortOrder: ObjectiveSortOrder.Ascending })
    }
}

export { Scorebar }