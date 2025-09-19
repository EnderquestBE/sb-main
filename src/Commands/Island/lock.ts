import { CustomEnum, Entity } from "@serenityjs/core";
import { CommandOverload, Island } from "../../Classes/classes";

class IslandLockEnum extends CustomEnum {
    public static readonly identifier = "islandLock";
    public static options = ["lock", "unlock", "status"];
}

const IslandLockCommand = new CommandOverload({
    lock: IslandLockEnum,
}).onCallback((origin, { lock }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    try {
        const checkStatus = lock.result === "status" ? true : false
        const island = player.getIsland()
        if (!island)
            return player.error(
                `You don't have an island! Use /is create <name> to create one.`
            );
        if (checkStatus) {
            const status = island.getStatus()
            player.info(`§eYour island is currently ${status ? "§aunlocked" : "§clocked"}§e.`)
        } else {
            island.toggleStatus().then(() => {
                const status = island.getStatus();
                player.info(`${status ? "§a" : "§c"}Your island has been ${status ? "unlocked" : "locked"}.`);
            })
        }
    } catch (e) {
        Island.logger.warn(
            "Error during island lock for " + player.username + ": " + e
        );
    }
});

export { IslandLockCommand };