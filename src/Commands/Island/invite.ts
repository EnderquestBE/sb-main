import { CustomEnum, Entity } from "@serenityjs/core";
import { CommandOverload, Island, PlayerEnum } from "../../Classes";
import { Server } from "../../server";
import { IslandInvites } from "../../Handlers/Island/invites";

class IslandInviteEnum extends CustomEnum {
    public static readonly identifier = "islandInvite";
    public static options = ["invite"];
}

const IslandInviteCommand = new CommandOverload({
    invite: IslandInviteEnum,
    playerToInvite: PlayerEnum
}).onCallback((origin, { playerToInvite }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    try {
        const island = player.getIsland()
        if (!island)
            return player.error(
                `You don't have an island! Use /is create <name> to create one.`
            );

        const target = Server.instance.getPlayerByUsername(playerToInvite.result as string);
        if (!target) {
            return player.error("Player not found.");
        }

        if (island.isMember(target.xuid)) {
            return player.error("That player is already a member of your island.");
        }

        if (island.isBanned(target.xuid)) {
            return player.error("That player is banned from your island.");
        }

        if (IslandInvites.has(target, player)) {
            return player.error("That player has already been invited to your island.");
        }

        if (island.getMembers().length >= island.getLimit("members").max) {
            return player.error("Your island has reached the member limit.\n§dUse §e/is expand §dto increase it.");
        }

        IslandInvites.create(target, island, player, "member");
        player.info(`§e${target.username} §ahas been invited to join your island.`);
        target.info(`§e${player.username} §ahas invited you to join §d${island.getName()}§a!\n    §8»  §6Use §e/is §aaccept §7| §cdecline §e<name> §6to respond.`);

    } catch (e) {
        Island.logger.warn(
            "Error during island invite for " + player.username + ": " + e
        );
    }
});

export { IslandInviteCommand };