import { CustomEnum, Entity } from "@serenityjs/core";
import { CommandOverload, Island } from "../../Classes/classes";
import { Server } from "../../server";
import { PlayerEnum } from "../../Classes/Command/Enums/player";

class IslandRemoveEnum extends CustomEnum {
    public static readonly identifier = "islandRemove";
    public static options = ["remove"];
}

const IslandRemoveCommand = new CommandOverload({
    remove: IslandRemoveEnum,
    playerToRemove: PlayerEnum
}).onCallback((origin, { playerToRemove }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    try {
        const island = player.getIsland();
        if (!island) return player.error("You don't have an island!");

        const target = Server.instance.getPlayerByUsername(playerToRemove.result as string);
        if (!target) {
            return player.error("Player is offline or does not exist.");
        }

        if (!island.isMember(target.xuid)) {
            return player.error("That player is not a member of your island.");
        }

        if (island.getPlayerRoleLevel(player.xuid)! <= island.getPlayerRoleLevel(target.xuid)!) {
            return player.error("You do not have permission to remove this member.");
        }

        island.removeMember(target.xuid).then(result => {
            if (!result.success) return player.error(result.reason!);
            if (island.isOwner(target.xuid)) {
                target.setIslandName("")
            }
            player.info(`§aSuccessfully removed §e${target.username}§a from your island.`);
            target.info(`§cYou are no longer a member of the §e${island.getName()} §cisland.`);
        });
    } catch (e) {
        Island.logger.warn("Error during island member removal: " + e);
    }
});

export { IslandRemoveCommand };