import { CustomEnum, Entity } from "@serenityjs/core";
import { CommandOverload } from "../../Classes/classes";
import { IslandInvites } from "../../Handlers/Island/invites";
import { PlayerEnum } from "../../Classes/Command/Enums/player";
import { Server } from "../../server";

class IslandDeclineEnum extends CustomEnum {
    public static readonly identifier = "islandDecline";
    public static options = ["decline"];
}

const IslandDeclineCommand = new CommandOverload({
    decline: IslandDeclineEnum,
    declinePlayer: PlayerEnum
}).onCallback((origin, { declinePlayer }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    try {
        const requester = Server.instance.getPlayerByUsername(declinePlayer.result as string);
        if (!requester) return player.error("Player not found.");

        const invite = IslandInvites.get(player, requester);
        if (!invite) {
            return player.error("You do not have any pending invites from that player.");
        }

        player.info(`§cThe invite has been declined successfully.`);
        requester.info(`§e${player.username} §chas declined your invitation.`)
        IslandInvites.remove(player, requester);

    } catch (e) {
        console.error(e)
    }
});

export { IslandDeclineCommand };