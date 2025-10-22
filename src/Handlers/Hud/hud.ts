import { WorldTickSignal } from "@serenityjs/core"
import { Scorebar } from "./scorebar";
import { TooltipBar } from "./tooltipbar";
import { Server } from "../../server";

class PlayerHud {
    private static readonly tips = [
        "default",
        " §d➤ §7Join our §9/discord§7."
    ]

    private static tipIndex = 0;

    public static runtime({ currentTick, world }: WorldTickSignal) {
        if (currentTick % 20n !== 0n) return;
        if (currentTick % 400n === 0n) this.tipIndex = (this.tipIndex + 1) % this.tips.length;

        const globalMultiplier = Server.globalMultiplier;
        const formattedMultiplier = globalMultiplier > 1 ? `§dx${globalMultiplier.toFixed(globalMultiplier % 1 === 0 ? 1 : 2)}` : "";

        for (const player of world.getPlayers()) {
            const hudMode = player.getSetting("hudMode")
            if (hudMode === "scoreboard")
                Scorebar.update(player, player.isWorldIsland() ? player.getWorldIsland() : player.getIsland(), formattedMultiplier, this.tips[this.tipIndex]!)
            else if (hudMode === "tooltip")
                TooltipBar.update(player, player.isWorldIsland() ? player.getWorldIsland() : player.getIsland())
            else continue
        }
    }
}

export { PlayerHud }