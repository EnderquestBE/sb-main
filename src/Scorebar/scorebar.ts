import { Player, Serenity, World, WorldEvent } from "@serenityjs/core";
import { DisplaySlotType, ObjectiveSortOrder } from "@serenityjs/protocol";
import { Server } from "../server";
import { Utils } from "../Utils/utils";
import { Island } from "../Classes/classes";

class Scorebar {
    public static runtime(serenity: Serenity) {
        serenity.on(WorldEvent.WorldTick, async ({ currentTick, world }) => {
            if (Number(currentTick) % 20 !== 0) return
            for (let player of world.getPlayers()) {
                this.update(player, world, player.isWorldIsland() ? await player.getWorldIsland() : await player.getIsland())
            }
        })
    }

    public static initialize(player: Player, world: World) {
        const scoreboard = world.scoreboard
        let objective = scoreboard.getObjective(`sbs_${player.xuid}`)
        objective ??= scoreboard.addObjective(`sbs_${player.xuid}`, "§l§dEnder§eQuest §bSB")
        scoreboard.setObjectiveAtDisplaySlot(DisplaySlotType.Sidebar, { objective: objective, player: player, sortOrder: ObjectiveSortOrder.Ascending })
    }

    private static update(player: Player, world: World, island: Island | null) {
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
        addScore(`§d➲ §aGT: §f${player.username}`);
        addScore(`§d➲ §ePlayers: §f${world.getPlayers().length}§7/§f${20}`);
        addScore(`§d➲ §3Ping: §f10ms`);
        addScore(`§d➲ §6Money: §f$${Utils.formatInt(player.getMoney())}`);
        if (player.isWorldIsland() && island) {
            addScore(`§b❖ Island Stats ❖`);
            addScore(` §b匚 §eIsland: §f${island.getName()}`);
            addScore(` §b匚 §6Owner: §f${island.getOwner().username}`);
            addScore(` §b匚 §cBank: §f$${Utils.formatInt(island.getBankBalance())}`);
            addScore(` §b匚 §aLevel: §f${island.getLevel()}`);
            addScore(` §b匚 §2Points: §f${0}§7/§f${150}`);
            addScore(` §b匚 §dSize: §f${island.getSize()} Blocks`);
            addScore(`§d➤ §7Try using §6/is help§7.`);
            scoreboard.setObjectiveAtDisplaySlot(DisplaySlotType.Sidebar, { objective: objective, player: player, sortOrder: ObjectiveSortOrder.Ascending })
        } else {
            addScore(`§b❖ Your Stats ❖`);
            addScore(` §b匚 §aRank: §f${"Guest"}`);
            if (island) {
                addScore(` §b匚 §2Island: §f${island.getName()}`);
                addScore(` §b匚 §eLevel: §f${island.getLevel()}`);
            } else {
                addScore(" §b匚 §2Island: §f§e/is create");
                addScore(" §b匚 §eLevel: §f--");
            }
            addScore(` §b匚 §6Time: §f${Utils.formatDuration(player.getTimePlayed())}`);
            addScore(` §b匚 §cK: §f0 §9D: §f0 §5R: §f0`);
            addScore(`§d➤ §7Use §6/hud §7to disable.`);
            scoreboard.setObjectiveAtDisplaySlot(DisplaySlotType.Sidebar, { objective: objective, player: player, sortOrder: ObjectiveSortOrder.Ascending })
        }
    }
}

export { Scorebar }