import { CustomEnum, Entity } from "@serenityjs/core";
import { CommandOverload, Island } from "../../Classes/classes";
import { Server } from "../../server";
import { Warp } from "../../Classes/Warp/warp";
import { PlayerEnum } from "../../Classes/Command/Enums/player";

class IslandBanEnum extends CustomEnum {
    public static readonly identifier = "islandBan";
    public static options = ["ban"];
}

const IslandBanCommand = new CommandOverload({
    ban: IslandBanEnum,
    banPlayer: PlayerEnum
}).onCallback((origin, { banPlayer }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    try {
        const island = player.getIsland()
        if (!island)
            return player.error(
                `You don't have an island! Use /is create <name> to create one.`
            );

        const target = Server.instance.getPlayerByUsername(banPlayer.result as string);
        if (!target) {
            player.error("Player is offline or does not exist.");
            return
        }

        if (island.isBanned(target.xuid)) {
            player.error("Player is already banned from your island.")
            return
        }

        if (island.isOwner(target.xuid)) {
            if (island.getData().owner.xuid === player.xuid) player.error("You must demote this player before they can be banned.")
            else player.error("You do not have permission to ban this player.");
            return
        }

        island.banPlayer(target.xuid).then(() => {
            if (target.world.identifier === island.getWorldId()) Warp.to(target, "SPAWN");
            target.info(`§4You have been banned from §e${island.getName()}§4.`);
            player.info(`§a${target.username} §ehas been §4banned §efrom the island.`);
        })

    } catch (e) {
        Island.logger.warn(
            "Error during island ban for " + player.username + ": " + e
        );
    }
});

export { IslandBanCommand };