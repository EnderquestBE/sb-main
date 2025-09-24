import { CustomEnum, Entity } from "@serenityjs/core";
import { CommandOverload, Island, PlayerEnum } from "../../Classes";
import { Server } from "../../server";

class IslandTransferEnum extends CustomEnum {
    public static readonly identifier = "islandTransfer";
    public static options = ["transfer"];
}

const IslandTransferCommand = new CommandOverload({
    transfer: IslandTransferEnum,
    owner: PlayerEnum
}).onCallback((origin, { owner }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    try {
        const island = player.getIsland();
        if (!island) {
            return player.error(`You don't have an island! Use /is create <name> to create one.`);
        }

        if (island.getOwner().xuid !== player.xuid) {
            return player.error("Only the island owner can transfer ownership.");
        }

        const target = Server.instance.getPlayerByUsername(owner.result as string);
        if (!target) {
            return player.error("Player is offline or does not exist.");
        }

        if (!island.getCoOwners().some((x) => x.xuid === target.xuid)) {
            return player.error("Player must already be a co-owner on your island to transfer ownership. §6Use §e/is makeowner§c first.");
        }

        island.setOwner(target.xuid, target.username).then(async () => {
            await player.setIslandName("")
            await island.removeMember(target.xuid)
            player.info(`§eYou have transferred ownership of §d${island.getName()} §eto §6${target.username}§e.`);
            target.info(`§6You are now the owner of the §e${island.getName()} §6island.`);
        });

    } catch (e) {
        Island.logger.warn("Error during island ownership transfer: " + e);
    }
});

export { IslandTransferCommand };