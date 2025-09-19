import { CustomEnum, Entity, StringEnum } from "@serenityjs/core";
import { CommandOverload, Island } from "../../Classes/classes";
import { Vector3f } from "@serenityjs/protocol";

class IslandVisitEnum extends CustomEnum {
    public static readonly identifier = "islandVisit";
    public static options = ["visit", "teleport", "tp"];
}

const IslandVisitCommand = new CommandOverload({
    visit: IslandVisitEnum,
    name: StringEnum
}).onCallback((origin, { name }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    try {
        if (!name.result) return player.error("Expected island name to teleport to.")
        const island = Island.loadSync(name.result)
        if (!island) return player.error("Island is offline or does not exist.")
        if (island.isBanned(player.xuid)) return player.error("You are banned from this island.")
        if (island.getStatus() === false && !island.isMember(player.xuid)) return player.error("This island is locked to visitors.")
        island.teleport(player)
        player.info(
            `§eYou have been teleported to island §a${island.getName()}§e's spawn!`
        );
        const owners = island.getOnlineOwners()
        for (let owner of owners) {
            owner.info(
                `§a${player.username} §ejust teleported to your island with §d/is visit§e! To prevent visitors, lock your island with §9/is lock§e.`
            )
        }
    } catch (e) {
        Island.logger.warn(
            "Error during island visit for " + player.username + ": " + e
        );
    }
});

export { IslandVisitCommand };
