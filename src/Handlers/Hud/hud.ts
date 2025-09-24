import { WorldTickSignal } from "@serenityjs/core"
import { Scorebar } from "./scorebar";
import { TooltipBar } from "./tooltipbar";

class PlayerHud {
    public static runtime({ currentTick, world }: WorldTickSignal) {
        if (currentTick % 20n !== 0n) return;
        for (const player of world.getPlayers()) {
            const hudMode = player.getSetting("hudMode")
            if (hudMode === "scoreboard")
                Scorebar.update(player, player.isWorldIsland() ? player.getWorldIsland() : player.getIsland())
            else if (hudMode === "tooltip")
                TooltipBar.update(player, player.isWorldIsland() ? player.getWorldIsland() : player.getIsland())
            else continue
        }
    }
}

export { PlayerHud }