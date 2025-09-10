import { CustomEnum, Entity } from "@serenityjs/core";
import { CommandOverload, Island } from "../../Classes/classes";
import { Vector3f } from "@serenityjs/protocol";
import { Server } from "../../server";

class IslandRandomVisitEnum extends CustomEnum {
    public static readonly identifier = "islandRandomVisit";
    public static options = ["randomvisit", "rvisit", "rtp"];
}

const IslandRandomVisitCommand = new CommandOverload({
    rvisit: IslandRandomVisitEnum
}).onCallback((origin) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    try {
        const players = Server.instance.getPlayers()
        const islandNames: string[] = []
        for (const player of players) {
            const name = player.getIslandName()
            if (islandNames.includes(name)) continue
            islandNames.push(name)
        }
        function chooseRandomIsland() {
            const name = islandNames[Math.floor(Math.random() * islandNames.length)]!
            Island.load(name).then((island) => {
                if (!island || (island.getStatus() === false && !island.hasRole(player.xuid))) return chooseRandomIsland()
                const islandWorld = island.getWorld();
                if (!islandWorld) {
                    Island.logger.error(
                        "Unable to get island world to warp for " + player.username + "."
                    );
                    return;
                }
                player.teleport(new Vector3f(0.5, 2, 0.5), islandWorld.getDimension());
                player.info(
                    `§eYou have been teleported to island §a${island.getName()}§e's spawn!`
                );
                const owners = island.getOnlineOwners()
                for (let owner of owners) {
                    owner.info(
                        `§a${player.username} §ejust teleported to your island with §d/is rvisit§e! To prevent visitors, lock your island with §9/is lock§e.`
                    )
                }
            })
        }
        chooseRandomIsland()
    } catch (e) {
        Island.logger.warn(
            "Error during island visit for " + player.username + ": " + e
        );
    }
});

export { IslandRandomVisitCommand };
