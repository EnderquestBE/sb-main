import { ActionForm, CustomEnum, Entity, StringEnum } from "@serenityjs/core";
import { CommandOverload, Island } from "../../Classes";
import { Vector3f } from "@serenityjs/protocol";

class IslandHomesEnum extends CustomEnum {
    public static readonly identifier = "islandHomes";
    public static options = ["homes"];
}

class IslandHomesListEnum extends CustomEnum {
    public static readonly identifier = "islandHomesList";
    public static options = ["list"];
}

const IslandHomesListCommand = new CommandOverload({
    homes: IslandHomesEnum,
    list: IslandHomesListEnum,
    islandName: [StringEnum, true]
}).onCallback((origin, { list, islandName }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    if (!list) return;
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

        player.info(`§6Island homes on §e${island.getName()}§6: ${island.getHomes().map(h => `§d${h.name}`).join("§6, ") || "§7No homes set."}`)

    } catch (e) {
        Island.logger.warn(`Error showing island homes for ${player.username}: ${e}`);
    }
});

const IslandHomesCommand = new CommandOverload({
    homes: IslandHomesEnum,
    islandName: [StringEnum, true]
}).onCallback((origin, { islandName }) => {
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

        const homes = island.getHomes();
        if (homes.length === 0) {
            return player.info("§6Your island has no homes set. Use §e/is sethome <name> §6to create one.");
        }

        const form = new ActionForm("Island Homes", "Select a home to teleport to.");

        for (const home of homes) {
            form.button(`§5${home.name}`);
        }

        form.show(player, (result, error) => {
            if (error || result === null) return;
            const selectedHome = homes[result];
            if (selectedHome) {
                island.teleport(player);
                player.teleport(new Vector3f(selectedHome.location.x, selectedHome.location.y, selectedHome.location.z));
                player.info(`§eYou have been teleported to home §d${selectedHome.name} §eon §a${island.getName()}§e.`);
            }
        });

    } catch (e) {
        Island.logger.warn(`Error showing island homes for ${player.username}: ${e}`);
    }
});

export { IslandHomesCommand, IslandHomesListCommand };