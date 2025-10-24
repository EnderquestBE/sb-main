import { CustomEnum, Entity, StringEnum } from "@serenityjs/core";
import { CommandOverload, Island } from "../../Classes";

class IslandDelHomeEnum extends CustomEnum {
    public static readonly identifier = "islandDelHome";
    public static options = ["delhome", "rmhome"];
}

const IslandDelHomeCommand = new CommandOverload({
    delhome: IslandDelHomeEnum,
    homeName: StringEnum
}).onCallback((origin, { homeName }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    try {
        const island = player.getIsland();
        if (!island)
            return player.error(
                `You don't have an island! Use /is create <name> to create one.`
            );

        const name = homeName.result!;
        if (!island.hasHome(name)) {
            return player.error("Your island has no home set with that name.");
        }

        island.removeHome(name).then(result => {
            if (result.success) {
                player.info(`§cIsland home §e${name} §chas been deleted.`);
            } else {
                player.error(result.reason ?? "Failed to delete the home.");
            }
        });

    } catch (e) {
        Island.logger.warn(`Error deleting island home for ${player.username}: ${e}`);
    }
});

export { IslandDelHomeCommand };