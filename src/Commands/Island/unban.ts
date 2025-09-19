import { CustomEnum, Entity } from "@serenityjs/core";
import { CommandOverload, Island } from "../../Classes/classes";
import { Server } from "../../server";
import { PlayerEnum } from "../../Classes/Command/Enums/player";

class IslandUnbanEnum extends CustomEnum {
    public static readonly identifier = "islandUnban";
    public static options = ["unban"];
}

const IslandUnbanCommand = new CommandOverload({
    unban: IslandUnbanEnum,
    unbanPlayer: PlayerEnum
}).onCallback((origin, { unbanPlayer }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    try {
        const island = player.getIsland()
        if (!island)
            return player.error(
                `You don't have an island! Use /is create <name> to create one.`
            );

        const target = Server.instance.getPlayerByUsername(unbanPlayer.result as string);
        if (!target) {
            player.error("Player is offline or does not exist.");
            return
        }

        if (!island.isBanned(target.xuid)) {
            player.error("Player is not banned from your island.")
            return
        }

        island.unbanPlayer(target.xuid).then(() => {
            target.info(`§7You have been unbanned from §e${island.getName()}§7.`);
            player.info(`§a${target.username} §ehas been §7unbanned §efrom the island.`);
        })

    } catch (e) {
        Island.logger.warn(
            "Error during island unban for " + player.username + ": " + e
        );
    }
});

export { IslandUnbanCommand };