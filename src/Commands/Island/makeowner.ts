import { CustomEnum, Entity } from "@serenityjs/core";
import { CommandOverload, Island } from "../../Classes/classes";
import { Server } from "../../server";
import { PlayerEnum } from "../../Classes/Command/Enums/player";
import { IslandInvites } from "../../Handlers/Island/invites";
import { IslandRoleDisplay } from "../../Configuration/config";

class IslandMakeOwnerEnum extends CustomEnum {
    public static readonly identifier = "islandMakeOwner";
    public static options = ["makeowner"];
}

const IslandMakeOwnerCommand = new CommandOverload({
    makeowner: IslandMakeOwnerEnum,
    newOwner: PlayerEnum
}).onCallback((origin, { newOwner }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    try {
        const island = player.getIsland();
        if (!island) return player.error("You don't have an island!");

        if (island.getData().owner.xuid !== player.xuid) {
            return player.error("Only the island owner can grant co-ownership of the island.");
        }

        const target = Server.instance.getPlayerByUsername(newOwner.result as string);
        if (!target) {
            return player.error("Player is offline or does not exist.");
        }

        if (!island.isAdmin(target.xuid)) {
            return player.error("Player must be an island admin become a co-owner.\n§6Use §e/is promote§6 to promote them.");
        }

        if (island.getCoOwners().length >= island.getLimit("coowners").max) {
            return player.error("Your island has reached the co-owner limit.\n§dUse §e/is expand §dto increase it.");
        }

        IslandInvites.create(target, island, player, "coowner");
        player.info(`§eYou have offered ${IslandRoleDisplay.coowner}ship §eto §6${target.username}§e.`);
        target.info(`§e${player.username} §6has invited you to become a ${IslandRoleDisplay.coowner} §6of §d${island.getName()}§6!\n    §8»  §6Use §e/is accept §7| §cdecline §e<name> §6to respond.`);

    } catch (e) {
        Island.logger.warn("Error during island co-owner invite: " + e);
    }
});

export { IslandMakeOwnerCommand };