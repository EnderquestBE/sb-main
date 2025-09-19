import { CustomEnum, Entity } from "@serenityjs/core";
import { CommandOverload, Island } from "../../Classes/classes";
import { Server } from "../../server";
import { Warp } from "../../Classes/Warp/warp";
import { PlayerEnum } from "../../Classes/Command/Enums/player";

class IslandKickEnum extends CustomEnum {
    public static readonly identifier = "islandKick";
    public static options = ["kick"];
}

const IslandKickCommand = new CommandOverload({
    kick: IslandKickEnum,
    kickPlayer: PlayerEnum
}).onCallback((origin, { kickPlayer }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    try {
        const island = player.getWorldIsland()

        if (!island) {
            player.error("You are not currently on an island.")
            return
        }

        const playerRolePermission = island.getPlayerRoleLevel(player.xuid) ?? -1

        if (playerRolePermission < 1) {
            player.error("Only island admins can kick players.")
            return
        }

        const target = Server.instance.getPlayerByUsername(kickPlayer.result! as string);
        if (!target) {
            player.error("Player is offline or does not exist.");
            return
        }

        const targetRolePermission = island.getPlayerRoleLevel(target.xuid) ?? -1
        if (targetRolePermission >= playerRolePermission) {
            player.error("You do not have permission to kick this player.");
            return
        }

        if (target.world.identifier !== island.getWorldId()) {
            return player.error("Player is not on the island.");
        }

        Warp.to(target, "SPAWN");
        target.info(`§cYou have been kicked from §e${island.getName()}§c: Kicked by admin.`);
        player.info(`§a${target.username} §ehas been §ckicked §efrom the island.`);

    } catch (e) {
        Island.logger.warn(
            "Error during island kick for " + player.username + ": " + e
        );
    }
});

export { IslandKickCommand };