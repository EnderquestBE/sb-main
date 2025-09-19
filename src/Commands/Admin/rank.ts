import { CustomEnum, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes/classes";
import { PlayerEnum } from "../../Classes/Command/Enums/player";
import { Server } from "../../server";
import { PlayerRank, RANKS } from "../../Configuration/Ranks/ranks";

// Enum for the rank command actions
class RankActionEnum extends CustomEnum {
    public static readonly identifier = "rankAction";
    public static options = ["set", "add", "remove"];
}

// Enum for the available ranks
class RankEnum extends CustomEnum {
    public static readonly identifier = "rankEnum";
    public static options = Object.keys(PlayerRank);
}

new CommandBuilder("rank", "Manages player ranks.")
    .setPermissions(["serenity.operator"])
    .addOverload(
        new CommandOverload({
            action: RankActionEnum,
            player: PlayerEnum,
            rank: RankEnum
        }).onCallback((origin, { action, player, rank }) => {
            if (!(origin instanceof Player)) return;

            const target = Server.instance.getPlayerByUsername(player.result as string);
            if (!target) {
                return origin.error("Player not found.");
            }

            const rankId = rank.result as keyof typeof PlayerRank;
            const rankInfo = RANKS.get(rankId);

            if (!rankInfo) {
                return origin.error("Invalid rank specified.");
            }

            switch (action.result) {
                case "add": {
                    const result = target.addRank(rankId).then((result) => {
                        if (result.success) {
                            origin.info(`§aSuccessfully added the ${rankInfo.displayName} §arank to §e${target.username}§a.`);
                            target.info(`§aYou have been given the ${rankInfo.displayName} §arank!`);
                        } else {
                            origin.error(result.reason ?? "Failed to add rank.");
                        }
                    })
                    break;
                }
                case "remove": {
                    const result = target.removeRank(rankId).then((result) => {
                        if (result.success) {
                            origin.info(`§aSuccessfully removed the ${rankInfo.displayName} §arank from §e${target.username}§a.`);
                            target.info(`§cYour ${rankInfo.displayName} §crank has been removed.`);
                        } else {
                            origin.error(result.reason ?? "Failed to remove rank.");
                        }
                    })
                    break;
                }
                case "set": {
                    const result = target.setRank(rankId).then((result) => {
                        if (result.success) {
                            origin.info(`§aSuccessfully set §e${target.username}§a's active rank to ${rankInfo.displayName}§a.`);
                            target.info(`§aYour active rank is now ${rankInfo.displayName}§a.`);
                        } else {
                            origin.error(result.reason ?? "Failed to set rank.");
                        }
                    })
                    break;
                }
            }
        })
    )
    .register("Admin");