import { CustomEnum, Entity, StringEnum } from "@serenityjs/core";
import { CommandOverload, Island } from "../../Classes";
import { Vector3f } from "@serenityjs/protocol";

class IslandHomeEnum extends CustomEnum {
    public static readonly identifier = "islandHome";
    public static options = ["home"];
}

const IslandHomeCommand = new CommandOverload({
    home: IslandHomeEnum,
    homeName: StringEnum,
    islandName: [StringEnum, true]
}).onCallback((origin, { homeName, islandName }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    try {
        //@ts-ignore
        const name = islandName.result ?? player.getIsland()?.getName();
        if (!name) return player.error("You don't have an island! Use /is create <name> to create one.")

        const island = Island.loadSync(name);
        if (!island) return player.error("Island is offline or does not exist.");

        if (!island.isMember(player.xuid)) {
            return player.error("You are not a member of that island.");
        }

        const home = island.getHome(homeName.result!);
        if (!home) return player.error("There are no island homes by that name.");

        island.teleport(player);
        const { x, y, z } = home.location
        player.teleport(new Vector3f(x, y, z));
        player.info(`§eYou have been teleported to home §d${home.name} §eon §a${island.getName()}§e.`);

    } catch (e) {
        Island.logger.warn("Error teleporting to island home: " + e);
    }
});

export { IslandHomeCommand };