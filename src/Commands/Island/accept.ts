import { CustomEnum, Entity } from "@serenityjs/core";
import { CommandOverload, Island, PlayerEnum } from "../../Classes";
import { IslandInvites } from "../../Handlers";
import { IslandRoleDisplay } from "../../Configuration/config";
import { Server } from "../../server";

class IslandAcceptEnum extends CustomEnum {
    public static readonly identifier = "islandAccept";
    public static options = ["accept"];
}

const IslandAcceptCommand = new CommandOverload({
    accept: IslandAcceptEnum,
    acceptPlayer: PlayerEnum
}).onCallback((origin, { acceptPlayer }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    try {
        const requester = Server.instance.getPlayerByUsername(acceptPlayer.result as string);
        if (!requester) return player.error("Player not found.");

        const invite = IslandInvites.get(player, requester);
        if (!invite) {
            return player.error("You do not have a pending invite from that player.");
        }

        const { island, type } = invite;

        if (type === "member") {
            island.addMember({ xuid: player.xuid, username: player.username }).then((result) => {
                if (!result.success) {
                    return player.error(result.reason!);
                }
                player.info(`§eYou are now a member of the §a${island.getName()}§e island.`);
                requester.info(`§e${player.username} §ahas accepted your invitation!`);
                player.setMemberOfIsland(island.getName());
                IslandInvites.remove(player, requester);
            });
        } else if (type === "coowner") {
            if (player.getIsland()) {
                return player.error("You must delete your current island before accepting co-ownership of another.");
            }
            player.setIslandName(island.getName()).then((result) => {
                if (!result.success) {
                    return player.error(result.reason!);
                }
                island.updateMemberRole(player.xuid, player.username, "coowner").then((result2) => {
                    if (!result2.success) {
                        return player.error(result2.reason!);
                    }
                    player.info(`§6You have been §dpromoted §6to ${IslandRoleDisplay.coowner}§6 on island §e${island.getName()}§6.`);
                    requester.info(`§6${player.username} §eis now a ${IslandRoleDisplay.coowner} §eof your island.`);
                    if (!player.isMemberOfIsland(island.getName())) player.setMemberOfIsland(island.getName());
                    IslandInvites.remove(player, requester);
                });
            })
        }

    } catch (e) {
        Island.logger.warn(
            "Error during island accept for " + player.username + ": " + e
        );
    }
});

export { IslandAcceptCommand };