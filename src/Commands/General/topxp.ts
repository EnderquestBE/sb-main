import { IntegerEnum, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";
import { LeaderboardHandler } from "../../Handlers";

const bridgeTop = "=".repeat(22)
const bridgeBottom = "=".repeat(23)

new CommandBuilder("topxp", "Shows the players with the top XP.")
    .setAliases(["baltopxp"])
    .addOverload(
        new CommandOverload({
            page: [IntegerEnum, true]
        }).onCallback((player, { page: pageRaw }) => {
            if (!(player instanceof Player)) return;
            //@ts-ignore
            const page = pageRaw?.result ?? 1;
            if (page < 1) return player.error("Invalid page.");
            try {
                const topXP = LeaderboardHandler.getScores("xp");
                if (!topXP) return player.error("No players found.");
                const maxPage = Math.ceil((topXP.length || 0) / 10)
                if (page > maxPage) return player.error("Invalid page.");
                player.sendMessage("§7" + bridgeTop + " §eTOP XP §f" + "§7" + bridgeTop);
                const xpDisplay = topXP.slice((page - 1) * 10, page * 10);
                for (const entry of xpDisplay) {
                    player.sendMessage(`§7» §f${entry.rank}. §d${entry.name} §7- §c${entry.value}`);
                }
                player.sendMessage(`§7${bridgeBottom} §e${page}/${maxPage} §7${bridgeBottom.slice((page.toString().length - 1) + maxPage.toString().length - 1)}`);

            } catch (e) {
                console.error("Failed to show top money to " + player.username + ": " + e);
            }
        })
    )
    .register("General");