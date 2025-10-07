import { CustomEnum, Entity, IntegerEnum, Player } from "@serenityjs/core";
import { CommandOverload, Island } from "../../Classes";
import { ChatHandler, LeaderboardHandler } from "../../Handlers";

class IslandTopEnum extends CustomEnum {
    public static readonly identifier = "islandTop";
    public static options = ["top", "leaderboard"];
}

const bridgeTop = "=".repeat(19)
const bridgeBottom = "=".repeat(23)

const IslandTopCommand = new CommandOverload({
    top: IslandTopEnum,
    page: [IntegerEnum, true]
}).onCallback((player, { page: pageRaw }) => {
    if (!(player instanceof Player)) return;
    //@ts-ignore
    const page = pageRaw?.result ?? 1;
    if (page < 1) return player.error("Invalid page.");
    try {
        const topIslands = LeaderboardHandler.getScores("islandLevel");
        if (!topIslands) return player.error("No islands found.");
        const maxPage = Math.ceil((topIslands.length || 0) / 10)
        if (page > maxPage) return player.error("Invalid page.");
        player.sendMessage("§7" + bridgeTop + " §eTOP ISLANDS §f" + "§7" + bridgeTop);
        const islandsDisplay = topIslands.slice((page - 1) * 10, page * 10);
        for (const entry of islandsDisplay) {
            player.sendMessage(`§7» §f${entry.rank}. §a${entry.name} §7- ${ChatHandler.chooseIslandLevelColor(entry.value)}${entry.value}`);
        }
        player.sendMessage(`§7${bridgeBottom} §e${page}/${maxPage} §7${bridgeBottom.slice((page.toString().length - 1) + maxPage.toString().length - 1)}`);

    } catch (e) {
        Island.logger.warn("Error showing island perks: " + e);
    }
});

export { IslandTopCommand };