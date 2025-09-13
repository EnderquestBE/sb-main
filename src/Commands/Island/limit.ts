import { CustomEnum, Entity } from "@serenityjs/core";
import { CommandOverload, Island } from "../../Classes/classes";
import { IslandLimitType } from "../../Types/types";
import { IslandLimitUnlocks } from "../../Handlers/Island/limits";
import { Utils } from "../../Utils/utils";

class IslandLimitEnum extends CustomEnum {
    public static readonly identifier = "islandLimit";
    public static options = ["limit"];
}

class IslandLimitTypeEnum extends CustomEnum {
    public static readonly identifier = "limitType"
    public static options: IslandLimitType[] = ["crops", "spawners", "hoppers", "coowners", "members", "homes", "bank"]
}

const bridgeTop = "=".repeat(20)
const bridgeBottom = "=".repeat(52)

const IslandLimitCommand = new CommandOverload({
    limit: IslandLimitEnum,
    limitType: IslandLimitTypeEnum
}).onCallback((origin, { limitType }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    try {
        const island = player.getIsland()
        if (!island) {
            return player.error("You don't have an island! Use /is create <name> to create one.")
        }
        if (!limitType.result) return
        const type = limitType.result as IslandLimitType
        const limit = island.getLimit(type)
        const info = IslandLimitUnlocks.get(type)
        const values: string[] = []
        switch (type) {
            case "crops":
                values.push(`§aCrops §8[§c${limit.max}§8]§f`,
                    `  §f» §7How many crops you can farm on your island.`,
                    `  §e» §6Increases by §d${info.amount}§6 every §aexpansion§6. §cCap: §f${info.maximum}`)
                break
            case "spawners":
                values.push(`§aSpawners §8[§c${limit.max}§8]§f`,
                    `  §f» §7How many spawners you can place on your island.`,
                    `  §e» §6Increases by §d${info.amount}§6 every §aexpansion§6. §cCap: §f${info.maximum}`)
                break
            case "hoppers":
                values.push(`§aHoppers §8[§c${limit.max}§8]§f`,
                    `  §f» §7How many hoppers you can place on your island.`,
                    `  §e» §6Increases by §d${info.amount}§6 every §aexpansion§6. §cCap: §f${info.maximum}`)
                break
            case "members":
                values.push(`§aIsland Members §8[§c${limit.max}§8]§f`,
                    `  §f» §7How many people you can invite to your island.`,
                    `  §e» §6Increases by §d${info.amount}§6 every §aexpansion§6. §cCap: §f${info.maximum}`)
                break
            case "coowners":
                values.push(`§aIsland Co-Owners §8[§c${limit.max}§8]§f`,
                    `  §f» §7How many people can share co-op ownership of your island.`,
                    `  §e» §6Increases by §d${info.amount}§6 every §a${info.interval} §6levels. §cCap: §f${info.maximum}`)
                break
            case "homes":
                values.push(`§aIsland Homes §8[§c${limit.max}§8]§f`,
                    `  §f» §7How many home locations you can set for your island.`,
                    `  §e» §6Increases by §d${info.amount}§6 every §a${info.interval} §6levels. §cCap: §f${info.maximum}`)
                break
            case "bank":
                values.push(`§aIsland Bank §8[§c$${Utils.formatInt(limit.max)}§8]§f`,
                    `  §f» §7How much you can store in your island's funds.`,
                    `  §e» §6Increases by §d$${Utils.formatInt(info.amount)}§6 every §a${info.interval} §6levels.`)
                break
        }
        player.sendMessage(bridgeTop + " §aISLAND LIMIT §f" + bridgeTop);
        player.sendMessage(values.join("\n"));
        player.sendMessage(bridgeBottom)
    } catch (e) {
        Island.logger.warn(
            "Error showing island limits for " + player.username + ": " + e
        );
    }
});

export { IslandLimitCommand };