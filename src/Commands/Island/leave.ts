import { CustomEnum, Entity, StringEnum } from "@serenityjs/core";
import { CommandOverload, Island } from "../../Classes/classes";

class IslandLeaveEnum extends CustomEnum {
    public static readonly identifier = "islandLeave";
    public static options = ["leave", "resign"];
}

const IslandLeaveCommand = new CommandOverload({
    leave: IslandLeaveEnum,
    islandName: [StringEnum, true]
}).onCallback((origin, { islandName }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;

    try {
        //@ts-ignore
        const targetIslandName = islandName.result ?? player.getIslandName();
        if (!targetIslandName) {
            return player.error("Island is offline or does not exist.");
        }

        Island.load(targetIslandName).then((island) => {
            if (!island) {
                return player.error("Island is offline or does not exist.");
            }

            if (!island.isMember(player.xuid)) {
                return player.error("You are not a member of this island.");
            }

            if (island.getOwner().xuid === player.xuid) {
                return player.error("You cannot leave your own island. Use /is delete to disband it.");
            }

            island.removeMember(player.xuid).then((result) => {
                if (result.success) {
                    if (island.isOwner(player.xuid)) {
                        player.setIslandName("")
                    }
                    player.info(`§cYou are no longer a member of the §e${island.getName()} §cisland.`);

                    const owners = island.getOnlineOwners();
                    for (const owner of owners) {
                        owner.info(`§e${player.username} §chas resigned from the island.`);
                    }
                } else {
                    player.error(result.reason ?? "Failed to leave the island.");
                }
            })
        })
    } catch (e) {
        Island.logger.warn(`Error during island leave for ${player.username}: ${e}`);
    }
});

export { IslandLeaveCommand };