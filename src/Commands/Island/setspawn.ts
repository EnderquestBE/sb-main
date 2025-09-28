import { CustomEnum, Entity } from "@serenityjs/core";
import { CommandOverload, Island } from "../../Classes";

class IslandSetSpawnEnum extends CustomEnum {
    public static readonly identifier = "islandSetSpawn";
    public static options = ["setspawn"];
}

const IslandSetSpawnCommand = new CommandOverload({
    setspawn: IslandSetSpawnEnum,
}).onCallback((origin) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    try {
        const island = player.getIsland()
        if (!island)
            return player.error(
                `You don't have an island! Use /is create <name> to create one.`
            );

        if (player.world.identifier !== island.getWorldId()) {
            return player.error("You are not on your island.");
        }

        if (!player.dimension.getBlock(player.position).below(1).isSolid) {
            return player.error("Island spawn must have a solid block under it.")
        }

        const location = player.position.clone()
        location.floor().add({ x: 0.5, y: 3, z: 0.5 })
        island.setSpawn(location);
        player.info(`§eYour island's spawn point has been set at your location!`);

    } catch (e) {
        Island.logger.warn(
            "Error setting island spawn for " + player.username + ": " + e
        );
    }
});

export { IslandSetSpawnCommand };