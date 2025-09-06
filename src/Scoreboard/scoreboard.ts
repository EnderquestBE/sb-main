import { Player, Serenity, WorldEvent } from "@serenityjs/core";
import { DisplaySlotType, ObjectiveSortOrder } from "@serenityjs/protocol";
import { Server } from "../server";
import { Utils } from "../Utils/utils";

class Scorebar {
    public static runtime(serenity: Serenity) {
        serenity.on(WorldEvent.WorldTick, ({ currentTick }) => {
            if (Number(currentTick) % 20 !== 0) return
            for (let player of serenity.getPlayers()) {
                this.update(player)
            }
        })
    }

    public static initialize(player: Player) {
        const scoreboard = player.world.scoreboard
        let objective = scoreboard.getObjective(`sbs_${player.xuid}`)
        if (objective) scoreboard.removeObjective(`sbs_${player.xuid}`)
        objective ??= scoreboard.addObjective(`sbs_${player.xuid}`, " §l§dEnder§5Quest")
        scoreboard.setObjectiveAtDisplaySlot(DisplaySlotType.Sidebar, { objective: objective, player: player, sortOrder: ObjectiveSortOrder.Ascending })
    }

    private static update(player: Player) {
        const scoreboard = player.world.scoreboard
        const objective = scoreboard.getObjective(`sbs_${player.xuid}`)
        if (!objective) {
            Server.logger.warn(`§6Player §e${player.username} §6is missing their scoreboard display.`)
            return
        }
        objective.clearScores()
        objective.setScore(`§b➲ §aUser: §f${player.username}`, 10);
        objective.setScore(`§b➲ §ePlayers: §f${player.world.getPlayers().length}§7/§f${20}`, 9);
        objective.setScore(`§b➲ §6Money: §f$${"607,259"}`, 8);
        objective.setScore(`§b➲ §dShards: §f${532}`, 7);
        objective.setScore(`§c❖ Your Stats ❖`, 6);
        objective.setScore(` §3匚 §aRank: §f${"Myth"}`, 5);
        objective.setScore(` §3匚 §2Island: §f${"TestIsland"}`, 4);
        objective.setScore(` §3匚 §eLevel: §f${14}`, 3);
        objective.setScore(` §3匚 §6Time: §f${Utils.formatDuration(568264)}`, 2);
        objective.setScore(` §3匚 §cKills: §f0 §9Deaths: §f0`, 1);
        objective.setScore(`§b➤ §7Use §6/hud §7to disable.`, 0);
        scoreboard.setObjectiveAtDisplaySlot(DisplaySlotType.Sidebar, { objective: objective, player: player, sortOrder: ObjectiveSortOrder.Descending })
    }
}

export { Scorebar }