import { IntegerEnum, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";
import { LeaderboardHandler } from "../../Handlers";
import { Utils } from "../../Utils";

const bridgeTop = "=".repeat(20)
const bridgeBottom = "=".repeat(23)

new CommandBuilder("topmoney", "Shows the players with the top money.")
    .setAliases(["baltop"])
    .addOverload(
        new CommandOverload({
            page: [IntegerEnum, true]
        }).onCallback((player, { page: pageRaw }) => {
            if (!(player instanceof Player)) return;
            //@ts-ignore
            const page = pageRaw?.result ?? 1;
            if (page < 1) return player.error("Invalid page.");
            try {
                const topMoney = LeaderboardHandler.getScores("money");
                if (!topMoney) return player.error("No players found.");
                const maxPage = Math.ceil((topMoney.length || 0) / 10)
                if (page > maxPage) return player.error("Invalid page.");
                player.sendMessage("§7" + bridgeTop + " §eTOP MONEY §f" + "§7" + bridgeTop);
                const moneyDisplay = topMoney.slice((page - 1) * 10, page * 10);
                for (const entry of moneyDisplay) {
                    player.sendMessage(`§7» §f${entry.rank}. §b${entry.name} §7- §6$${Utils.formatInt(entry.value)}`);
                }
                player.sendMessage(`§7${bridgeBottom} §e${page}/${maxPage} §7${bridgeBottom.slice((page.toString().length - 1) + maxPage.toString().length - 1)}`);

            } catch (e) {
                console.error("Failed to show top money to " + player.username + ": " + e);
            }
        })
    )
    .register("General");