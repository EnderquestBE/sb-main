import { CustomEnum, Entity, StringEnum } from "@serenityjs/core";
import { CommandOverload, Island, IslandLevel } from "../../Classes/classes";

class IslandStatsEnum extends CustomEnum {
    public static readonly identifier = "islandStats";
    public static options = ["stats", "info", "i"];
}

const bridgeTop = "=".repeat(20)
const bridgeBottom = "=".repeat(52)

const IslandStatsCommand = new CommandOverload({
    stats: IslandStatsEnum,
    nameResult: [StringEnum, true]
}).onCallback((origin, { nameResult }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    try {
        let getIsland: Promise<Island | null>
        //@ts-ignore
        const name = nameResult as { result: string } | null
        if (name?.result) getIsland = Island.load(name.result)
        else getIsland = player.getIslandAsync()
        getIsland.then((island) => {
            if (!island) {
                if (!name?.result) return player.error("You don't have an island! Use /is create <name> to create one.")
                else return player.error("No island was found that exists with that name.")
            }
            const { crops, spawners, hoppers, members, coowners, homes, bank } = island.getLimits()
            const totalPoints = island.getPoints();
            const currentLevel = IslandLevel.fromPoints(totalPoints);
            const values: string[] = [
                `§fIsland: §e${island.getName()}`,
                `§fOwner: §6${island.getOwner().username}   §fFounder: §d${island.getFounder().username}`,
                `§fStatus: ${island.isOnline() ? (island.getStatus() ? "§aUnlocked" : "§cLocked") : "§cOffline"}`,
                `§fLevel: §e${island.getLevel()} §fPoints: §a${totalPoints - IslandLevel.toPoints(currentLevel - 1)}§7/§2${150 * currentLevel}`,
                `§fBank: §e$${island.getBankBalance()}§7/§6$${bank.max}`,
                `§fCo-Owners§8[§6${island.getCoOwners().length}§7/§c${coowners.max}§8]§f: §9${island.getCoOwners().map(x => x.username).join(", ")}`,
                `§fAdmins§8[§6${island.getAdmins().length}§8]§f: §c${island.getAdmins().map(x => x.username).join(", ")}`,
                `§fHelpers§8[§6${island.getMembers().length}§7/§c${members.max}§8]§f: §a${island.getHelpers().map(x => x.username).join(", ")}`,
                `§fHomes§8[§6${island.getHomes().length}§7/§c${homes.max}§8]§f: §2${island.getHomes().map(x => x.name).join(", ")}`,
                `§fSize: §d${island.getSize()} Blocks`,
                `§fUnlocks: §eSpawner: §f${spawners.amount}/${spawners.max} §7(§f${Math.floor((spawners.amount / spawners.max) * 1000) / 10}§6%§7) §eHopper: §f${hoppers.amount}/${hoppers.max} §7(§f${Math.floor((hoppers.amount / hoppers.max) * 1000) / 10}§6%§7) §eCrops: §f${crops.amount}/${crops.max} §7(§f${Math.floor((crops.amount / crops.max) * 1000) / 10}§6%§7)`
            ];
            player.sendMessage(bridgeTop + " §eISLAND INFO §f" + bridgeTop);
            player.sendMessage(values.join("\n"));
            player.sendMessage(bridgeBottom)
        })
    } catch (e) {
        Island.logger.warn(
            "Error showing island stats for " + player.username + ": " + e
        );
    }
});

export { IslandStatsCommand };
