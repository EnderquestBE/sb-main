import { CustomEnum, Entity } from "@serenityjs/core";
import { CommandOverload, Island } from "../../Classes/classes";
import { Server } from "../../server";
import { PlayerEnum } from "../../Classes/Command/Enums/player";
import { IslandRole, IslandRoleHierarchy } from "../../Types/types";
import { IslandRoleDisplay } from "../../Configuration/config";

class IslandDemoteEnum extends CustomEnum {
    public static readonly identifier = "islandDemote";
    public static options = ["demote"];
}

const IslandDemoteCommand = new CommandOverload({
    demote: IslandDemoteEnum,
    playerToDemote: PlayerEnum
}).onCallback((origin, { playerToDemote }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    try {
        const island = player.getIsland();
        if (!island) return player.error("You don't have an island!");

        const target = Server.instance.getPlayerByUsername(playerToDemote.result as string);
        if (!target) {
            return player.error("Player is offline or does not exist.");
        }

        if (!island.isMember(target.xuid)) {
            return player.error("That player is not a member of your island.");
        }

        const targetRoleLevel = island.getPlayerRoleLevel(target.xuid)!;

        if (targetRoleLevel === IslandRoleHierarchy.coowner && island.getData().owner.xuid !== player.xuid) {
            return player.error("You are not allowed to demote other co-owners.");
        }

        if (targetRoleLevel <= IslandRoleHierarchy.helper) {
            return player.error("That player already has the lowest role.\n§6To remove them as a member, use §e/is remove§6.");
        }

        //@ts-ignore
        const prevRole: IslandRole | undefined = Object.keys(IslandRoleHierarchy).find(role => IslandRoleHierarchy[role as keyof typeof IslandRoleHierarchy] === targetRoleLevel - 1);
        if (!prevRole) {
            return player.error("That player cannot be demoted.");
        }

        island.updateMemberRole(target.xuid, target.username, prevRole).then(() => {
            player.info(`§e${target.username} §6has been §cdemoted §6to ${IslandRoleDisplay[prevRole]}§6.`);
            target.info(`§6You have been §cdemoted §6to ${IslandRoleDisplay[prevRole]}§6 on island §e${island.getName()}§6.`);
        });

    } catch (e) {
        Island.logger.warn("Error during island promotion: " + e);
    }
});

export { IslandDemoteCommand };