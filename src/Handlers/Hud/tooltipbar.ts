import { Player } from "@serenityjs/core";
import { Utils } from "../../Utils/utils";
import { Island } from "../../Classes";
import { Server } from "../../server";

class TooltipBar {
    // Tooltip title format.
    private static readonly TOOLTIP_TITLE = `§c§l<<- §l§dEnder§eQuest §bSB §c->>§r`;
    // Width to center text.
    private static readonly TOOLTIP_TARGET_WIDTH = 60;
    // Cache the padding amount needed for different string lengths so it doesn't have to be calculated every time.
    private static readonly textPaddingCache = new Map<string, string>();

    private static centerTooltipText(text: string): string {
        const cacheKey = `${this.TOOLTIP_TARGET_WIDTH}|${text}`;

        if (this.textPaddingCache.has(cacheKey)) {
            return this.textPaddingCache.get(cacheKey)!;
        }
        const visibleLength = Utils.stripColorCodes(text).length;
        if (visibleLength >= this.TOOLTIP_TARGET_WIDTH) {
            return text;
        }

        const leftPadding = Math.floor((this.TOOLTIP_TARGET_WIDTH - visibleLength) / 2);
        const targetLength = text.length + leftPadding;
        const result = text.padStart(targetLength, ' ');

        this.textPaddingCache.set(cacheKey, result);
        return result;
    }

    public static update(player: Player, island: Island | null) {
        const elements: string[] = [];
        if (player.isWorldIsland() && island) {
            elements.push(`§e[Island: §f${island.getName()}§e]`);
            elements.push(`§6[Owner: §f${island.getOwner().username}§6]`);
            elements.push(`§c[Bank: §f$${Utils.formatInt(island.getBankBalance())}§c]`);
            elements.push(`§a[Level: §f${island.getLevel()}§a]`);
            elements.push(`§2[Points: §f${0}§7/§f${150}§2]`);
            elements.push(`§d[Size: §f${island.getSize()} Blocks§d]`);
        } else {
            elements.push(`§b[GT: §f${player.username}§b]`);
            elements.push(`§e[Players: §f${Server.playerCount}§7/§f${20}§e]`);
            elements.push(`§6[Balance: §f$${Utils.formatInt(player.getMoney())}§6]`);
            elements.push(`§a[Rank: ${player.getPrimaryRank().displayName}§a]`);
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

        const finalLines: string[] = [this.centerTooltipText(this.TOOLTIP_TITLE)];
        for (let i = 0; i < elements.length; i += 3) {
            const lineElements = elements.slice(i, i + 3);
            const lineText = lineElements.join(' ');
            finalLines.push(this.centerTooltipText(lineText));
        }
        player.onScreenDisplay.setToolTip(finalLines.join('\n'));
    }
}

export { TooltipBar };