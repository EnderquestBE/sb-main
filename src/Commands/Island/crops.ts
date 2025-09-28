import { CustomEnum, Entity } from "@serenityjs/core";
import { CommandOverload, Island } from "../../Classes";
import { CropLevelRequirement } from "../../Configuration/config";
import { Utils } from "../../Utils/utils";

class IslandCropsEnum extends CustomEnum {
    public static readonly identifier = "islandCrops";
    public static options = ["crops"];
}

const bridgeTop = "=".repeat(19)
const bridgeBottom = "=".repeat(51)

const IslandCropsCommand = new CommandOverload({
    crops: IslandCropsEnum
}).onCallback((origin) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    try {
        const island = player.getIsland()
        if (!island)
            return player.error(
                `You don't have an island! Use /is create <name> to create one.`
            );

        player.sendMessage(bridgeTop + " §eISLAND CROPS §f" + bridgeTop);
        for (const [crop, levelReq] of Object.entries(CropLevelRequirement)) {
            const unlocked = island.getLevel() >= levelReq;
            player.sendMessage(`§7» §a${Utils.formatString(crop)}§e[§6${levelReq}§e] §7- ${unlocked ? "§aUnlocked" : "§cLocked"}`);
        }
        player.sendMessage(bridgeBottom)
    } catch (e) {
        Island.logger.warn("Error showing island crops: " + e);
    }
});

export { IslandCropsCommand };