import { Player } from "@serenityjs/core";
import { Island } from "../../Classes";

export type InviteType = "member" | "coowner";

interface Invite {
    island: Island;
    requester: Player;
    timestamp: number;
    type: InviteType;
}

const invites = new Map<string, Invite[]>();

class IslandInvites {
    public static create(player: Player, island: Island, requester: Player, type: InviteType) {
        const existingInvites = invites.get(player.xuid) || [];
        existingInvites.push({ island, requester, timestamp: Date.now(), type });
        invites.set(player.xuid, existingInvites);
    }

    public static has(player: Player, requester: Player): boolean {
        const playerInvites = invites.get(player.xuid);
        return !!playerInvites?.some(invite => invite.requester.xuid === requester.xuid);
    }

    public static get(player: Player, requester: Player): Invite | undefined {
        const playerInvites = invites.get(player.xuid);
        return playerInvites?.find(invite => invite.requester.xuid === requester.xuid && invite.timestamp + 120000 > Date.now()); // Expires in 2 minutes
    }

    public static remove(player: Player, requester: Player) {
        const playerInvites = invites.get(player.xuid);
        if (playerInvites) {
            const updatedInvites = playerInvites.filter(invite => invite.requester.xuid !== requester.xuid);
            if (updatedInvites.length > 0) {
                invites.set(player.xuid, updatedInvites);
            } else {
                invites.delete(player.xuid);
            }
        }
    }
}

export { IslandInvites }