import { CustomEnum, Entity } from "@serenityjs/core";
import { CommandOverload, Island } from "../../Classes/classes";
import { Vector3f } from "@serenityjs/protocol";

class IslandGoEnum extends CustomEnum {
    public static readonly identifier = "islandGo";
    public static options = ["go", "warp"];
}

const IslandGoCommand = new CommandOverload({
    go: IslandGoEnum,
}).onCallback((origin) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    try {
        const island = player.getIsland()
        if (!island)
            return player.error(
                `You don't have an island! Use /is create <name> to create one.`
            );

        const islandWorld = island.getWorld();
        if (!islandWorld) {
            Island.logger.error(
                "Unable to get island world to warp for " + player.username + "."
            );
            return;
        }

        player.teleport(new Vector3f(0.5, 2, 0.5), islandWorld.getDimension());

        player.info(
            `§aYou have been teleported to your island §e${island.getName()}§a spawn successfully!`
        );
    } catch (e) {
        Island.logger.warn(
            "Error during island warp for " + player.username + ": " + e
        );
    }
});

export { IslandGoCommand };
