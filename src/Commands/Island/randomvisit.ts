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
            const island = Island.loadSync(name)
            if (!island || (island.getStatus() === false && !island.isMember(player.xuid))) return chooseRandomIsland()
            island.teleport(player)
            player.info(
                `§eYou have been teleported to island §a${island.getName()}§e's spawn!`
            );
            const owners = island.getOnlineOwners()
            for (let owner of owners) {
                owner.info(
                    `§a${player.username} §ejust teleported to your island with §d/is randomvisit§e! To prevent visitors, lock your island with §9/is lock§e.`
                )
            }
        }
        chooseRandomIsland()
    } catch (e) {
        Island.logger.warn(
            "Error during island visit for " + player.username + ": " + e
        );
    }
});

export { IslandRandomVisitCommand };
