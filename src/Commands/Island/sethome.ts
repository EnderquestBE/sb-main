import { CustomEnum, Entity, StringEnum } from "@serenityjs/core";
import { CommandOverload, Island } from "../../Classes/classes";
import { Vector3f } from "@serenityjs/protocol";

class IslandSetHomeEnum extends CustomEnum {
    public static readonly identifier = "islandSetHome";
    public static options = ["sethome"];
}

const IslandSetHomeCommand = new CommandOverload({
    sethome: IslandSetHomeEnum,
    homeName: StringEnum
}).onCallback((origin, { homeName }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    try {
        const island = player.getIsland()
        if (!island)
            return player.error(
                `You don't have an island! Use /is create <name> to create one.`
            );

        if (island.getHomes().length >= island.getLimit("homes").max && !island.hasHome(homeName.result!)) {
            return player.error("Your island has reached the home limit.\n§dLevel up your island to increase it.");
        }

        if (player.world.identifier !== island.getWorldId()) {
            return player.error("You are not on your island.");
        }

        if (!player.dimension.getBlock(player.position).below(1).isSolid) {
            return player.error("Home locations must have a solid block under them.")
        }

        const name = homeName.result!;
        const location = player.position.clone()
        location.floor().add({ x: 0.5, y: 3, z: 0.5 })
        island.addHome({ name, location: location }).then(result => {
            if (!result.success) return player.error(result.reason!);
            player.info(`§dCreated new island home §e${name} §dat your position.`);
        });

    } catch (e) {
        Island.logger.warn("Error setting island home: " + e);
    }
});

export { IslandSetHomeCommand };