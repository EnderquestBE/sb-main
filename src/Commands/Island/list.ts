import { CustomEnum, Entity } from "@serenityjs/core";
import { CommandOverload, Island, PlayerEnum } from "../../Classes";

class IslandListEnum extends CustomEnum {
    public static readonly identifier = "islandList";
    public static options = ["list", "helper"];
}

const IslandListCommand = new CommandOverload({
    list: IslandListEnum,
    player: [PlayerEnum, true]
}).onCallback((origin, { player: playerNameRaw }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    //@ts-ignore
    const playerName = playerNameRaw?.result as string;
    const target = playerName ? player.world.serenity.getPlayerByUsername(playerName) : player;
    if (!target) {
        player.error("Player is offline or does not exist.");
        return;
    }
    try {
        const memberIslands = target.getIslandsMemberOf();
        if (memberIslands.length === 0 && target.getIslandName() === "") {
            player.error(`${target.username} is not a member of any islands.`);
            return;
        }
        player.info(`§6Islands for §e${target.username}§6: §a${target.getIslandName() ? `§d${target.getIslandName()}${memberIslands.length > 0 ? "§7, §a" : ""}` : ""}${memberIslands.join("§7, §a")}`);
    } catch (e) {
        Island.logger.warn(`Error showing island list for ${player.username}: ` + e);
    }
});

export { IslandListCommand };