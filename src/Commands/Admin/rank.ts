// src/Commands/Admin/rank.ts
import { CustomEnum, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload, PlayerEnum } from "../../Classes";
import { Server } from "../../server";
import { PlayerRank, RANKS } from "../../Configuration/Ranks/ranks";

// Enum for the rank command actions
class RankActionEnum extends CustomEnum {
    public static readonly identifier = "rankAction";
    public static options = ["add", "remove", "push", "pop"];
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
            if (action.result !== "pop" && !rankId) {
                return origin.error("Invalid rank specified.");
            }

            const rankInfo = RANKS.get(rankId);

            if (action.result !== "pop" && !rankInfo) {
                return origin.error("Invalid rank specified.");
            }

            switch (action.result) {
                case "add": {
                    target.addRank(rankId).then((result) => {
                        if (result.success) {
                            origin.info(`§aSuccessfully added the ${rankInfo!.displayName} §arank to §e${target.username}§a.`);
                            target.info(`§aYou have been given the ${rankInfo!.displayName} §arank!`);
                        } else {
                            origin.error(result.reason ?? "Failed to add rank.");
                        }
                    })
                    break;
                }
                case "remove": {
                    target.removeRank(rankId).then((result) => {
                        if (result.success) {
                            origin.info(`§aSuccessfully removed the ${rankInfo!.displayName} §arank from §e${target.username}§a.`);
                            target.info(`§cYour ${rankInfo!.displayName} §crank has been removed.`);
                        } else {
                            origin.error(result.reason ?? "Failed to remove rank.");
                        }
                    })
                    break;
                }
                case "push": {
                    target.pushActiveRank(rankId).then((result) => {
                        if (result.success) {
                            origin.info(`§aSuccessfully pushed the ${rankInfo!.displayName} §arank to §e${target.username}§a's active ranks.`);
                            target.info(`§aYour active ranks now include ${rankInfo!.displayName}§a.`);
                        } else {
                            origin.error(result.reason ?? "Failed to push rank.");
                        }
                    })
                    break;
                }
                case "pop": {
                    target.popActiveRank().then((result) => {
                        if (result.success) {
                            origin.info(`§aSuccessfully popped a rank from §e${target.username}§a's active ranks.`);
                            target.info(`§cOne of your active ranks has been removed.`);
                        } else {
                            origin.error(result.reason ?? "Failed to pop rank.");
                        }
                    })
                    break;
                }
            }
        })
    )
    .register("Admin");