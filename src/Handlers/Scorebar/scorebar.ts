import { Player, World, WorldTickSignal } from "@serenityjs/core";
import { DisplaySlotType, ObjectiveSortOrder } from "@serenityjs/protocol";
import { Island, IslandLevel } from "../../Classes/classes";
import { Server } from "../../server";
import { Utils } from "../../Utils/utils";

class Scorebar {
    private static barTitle = "§l§dEnder§eQuest §bSB"

    public static runtime({ currentTick, world }: WorldTickSignal) {
        if (Number(currentTick) % 20 !== 0) return
        for (const player of world.getPlayers()) {
            const hudMode = player.getSetting("hudMode")
            if (hudMode === "scoreboard")
                this.updateScoreboard(player, world, player.isWorldIsland() ? player.getWorldIsland() : player.getIsland())
            else if (hudMode === "tooltip")
                this.updateTooltip(player, world, player.isWorldIsland() ? player.getWorldIsland() : player.getIsland())
            else continue
        }
    }

    public static initialize(player: Player, world: World) {
        const scoreboard = world.scoreboard
        let objective = scoreboard.getObjective(`sbs_${player.xuid}`)
        objective ??= scoreboard.addObjective(`sbs_${player.xuid}`, this.barTitle)
        scoreboard.setObjectiveAtDisplaySlot(DisplaySlotType.Sidebar, { objective: objective, player: player, sortOrder: ObjectiveSortOrder.Ascending })
    }

    public static removeScoreboard(player: Player, world: World) {
        const scoreboard = world.scoreboard
        const objective = scoreboard.getObjective(`sbs_${player.xuid}`)
        if (objective) {
            scoreboard.clearObjectiveAtDisplaySlot(DisplaySlotType.Sidebar, { objective: objective, player: player, sortOrder: ObjectiveSortOrder.Ascending })
            scoreboard.removeObjective(`sbs_${player.xuid}`)
        }
    }

    public static removeTooltip(player: Player) {
        player.onScreenDisplay.setToolTip("")
    }

    private static updateScoreboard(player: Player, world: World, island: Island | null) {
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
        addScore(` §d➲ §aGT: §f${player.username}`);
        addScore(` §d➲ §ePlayers: §f${world.getPlayers().length}§7/§f${20}`);
        addScore(` §d➲ §6Money: §f$${Utils.formatInt(player.getMoney())}`);
        addScore(` §d➲ §cXP: §f${Utils.formatInt(player.getTotalXp())}`);
        if (player.isWorldIsland() && island) {
            addScore(`§b❖ Island Stats ❖`);
            addScore(` §b匚 §eIsland: §f${island.getName()}`);
            addScore(` §b匚 §6Owner: §f${island.getOwner().username}`);
            addScore(` §b匚 §cBank: §f$${Utils.formatInt(island.getBankBalance())}`);
            addScore(` §b匚 §aLevel: §f${island.getLevel()}`);
            const totalPoints = island.getPoints();
            const currentLevel = IslandLevel.fromPoints(totalPoints);
            addScore(` §b匚 §2Points: §f${totalPoints - IslandLevel.toPoints(currentLevel - 1)}§7/§f${150 * currentLevel}`);
            addScore(` §b匚 §dSize: §f${island.getSize()} Blocks`);
            addScore(`§d➤ §7Try using §6/is help§7.`);
        } else {
            //@ts-ignore
            addScore(` §d➲ §3Ping: §f${player.connection.ping}ms`);
            addScore(`§b❖ Your Stats ❖`);
            addScore(` §b匚 §aRank: ${player.getPrimaryRank().displayName}`);
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
        }
        scoreboard.setObjectiveAtDisplaySlot(DisplaySlotType.Sidebar, { objective: objective, player: player, sortOrder: ObjectiveSortOrder.Ascending })
    }


    private static readonly tooltipTargetWidth = 60;
    private static readonly textPaddingCache = new Map<string, string>();

    private static centerTooltipText(text: string): string {
        const cacheKey = `${this.tooltipTargetWidth}|${text}`;

        if (this.textPaddingCache.has(cacheKey)) {
            return this.textPaddingCache.get(cacheKey)!;
        }
        const visibleLength = Utils.stripColorCodes(text).length;
        if (visibleLength >= this.tooltipTargetWidth) {
            return text;
        }

        const leftPadding = Math.floor((this.tooltipTargetWidth - visibleLength) / 2);
        const targetLength = text.length + leftPadding;
        const result = text.padStart(targetLength, ' ');

        this.textPaddingCache.set(cacheKey, result);
        return result;
    }

    private static updateTooltip(player: Player, world: World, island: Island | null) {
        const elements: string[] = [];
        if (player.isWorldIsland() && island) {
            elements.push(`§e[Island: §f${island.getName()}§e]`);
            elements.push(`§6[Owner: §f${island.getOwner().username}§6]`);
            elements.push(`§c[Bank: §f$${Utils.formatInt(island.getBankBalance())}§c]`);
            elements.push(`§a[Level: §f${island.getLevel()}§a]`);
            elements.push(`§2[Points: §f${0}§7/§f${150}§2]`);
            elements.push(`§d[Size: §f${island.getSize()} Blocks§d]`);
        } else {
            elements.push(`§a[GT: §f${player.username}§a]`);
            elements.push(`§e[Players: §f${world.getPlayers().length}§7/§f${20}§e]`);
            elements.push(`§6[Money: §f$${Utils.formatInt(player.getMoney())}§6]`);
            elements.push(`§b[Rank: ${player.getPrimaryRank().displayName}§b]`);
            if (island) {
                elements.push(`§2[Island: §f${island.getName()}§2]`);
                elements.push(`§e[Level: §f${island.getLevel()}§e]`);
            } else {
                elements.push("§2[Island: §f/is create§2]");
                elements.push("§e[Level: §f--§e]");
            }
            elements.push(`§6[Time: §f${Utils.formatDuration(player.getTimePlayed())}§6]`);
            elements.push(`§c[K: §f0 §9D: §f0 §5R: §f0§c]`);
        }

        const finalLines: string[] = [this.centerTooltipText(`§c§l<<- ${this.barTitle} §c->>§r`)];
        for (let i = 0; i < elements.length; i += 3) {
            const lineElements = elements.slice(i, i + 3);
            const lineText = lineElements.join(' ');
            finalLines.push(this.centerTooltipText(lineText));
        }
        player.onScreenDisplay.setToolTip(finalLines.join('\n'));
    }
}

export { Scorebar }