import { CustomEnum, Entity } from "@serenityjs/core";
import { CommandOverload, Island } from "../../Classes/classes";
import { Server } from "../../server";
import { PlayerEnum } from "../../Classes/Command/Enums/player";
import { IslandRole, IslandRoleHierarchy } from "../../Types/types";
import { IslandRoleDisplay } from "../../Configuration/config";

class IslandPromoteEnum extends CustomEnum {
    public static readonly identifier = "islandPromote";
    public static options = ["promote"];
}

const IslandPromoteCommand = new CommandOverload({
    promote: IslandPromoteEnum,
    playerToPromote: PlayerEnum
}).onCallback((origin, { playerToPromote }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    try {
        const island = player.getIsland();
        if (!island) return player.error("You don't have an island!");

        const target = Server.instance.getPlayerByUsername(playerToPromote.result as string);
        if (!target) {
            return player.error("Player is offline or does not exist.");
        }

        if (!island.isMember(target.xuid)) {
            return player.error("That player is not a member of your island.");
        }

        const targetRoleLevel = island.getPlayerRoleLevel(target.xuid)!;

        if (targetRoleLevel >= IslandRoleHierarchy.admin) {
            if (targetRoleLevel === IslandRoleHierarchy.coowner && island.getData().owner.xuid === player.xuid) {
                return player.error("That player cannot be promoted.\n§6To make them a co-owner, use §e/is makeowner§6.");
            } else return player.error("That player cannot be promoted.");
        }

        //@ts-ignore
        const nextRole: IslandRole | undefined = Object.keys(IslandRoleHierarchy).find(role => IslandRoleHierarchy[role as keyof typeof IslandRoleHierarchy] === targetRoleLevel + 1);
        if (!nextRole) {
            return player.error("That player cannot be promoted.");
        }

        island.updateMemberRole(target.xuid, target.username, nextRole).then(() => {
            player.info(`§e${target.username} §6has been §dpromoted §6to ${IslandRoleDisplay[nextRole]}§6.`);
            target.info(`§6You have been §dpromoted §6to ${IslandRoleDisplay[nextRole]}§6 on island §e${island.getName()}§6.`);
        });

    } catch (e) {
        Island.logger.warn("Error during island promotion: " + e);
    }
});

export { IslandPromoteCommand };