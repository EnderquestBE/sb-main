import { ActionForm, CustomEnum, Entity, Player, StringEnum } from "@serenityjs/core";
import { CommandOverload, Island } from "../../Classes";

class IslandVisitEnum extends CustomEnum {
    public static readonly identifier = "islandVisit";
    public static options = ["visit", "teleport", "tp"];
}

function islandVisitForm(player: Player) {
    const form = new ActionForm("Visit Islands");
    form.content = "Select an option.";
    form.button("Select Island");
    form.button("Random Island");

    form.show(player, (result, error) => {
        if (result === null || error) return;
        if (result === 0) {
            // Select Island
            const form2 = new ActionForm("Select Island");
            form2.content = "Select an island to visit.";
            const players = player.world.serenity.getPlayers()
            const islands = new Map<string, Island>()
            for (const player of players) {
                const island = player.getIsland()
                if (island && !islands.has(island.getName())) {
                    islands.set(island.getName(), island)
                }
            }
            for (const [name, island] of islands) {
                form2.button(`${name}\nOwner: ${island.getOwner().username}`)
            }
            form2.show(player, (result2, error2) => {
                if (result2 === null || error2) return;
                const islandName = Array.from(islands.keys())[result2]
                player.executeCommand(`is visit ${islandName}`)
            })
        } else if (result === 1) {
            player.executeCommand("is randomvisit")
        }
    })
}

const IslandVisitCommand = new CommandOverload({
    visit: IslandVisitEnum,
    name: [StringEnum, true]
}).onCallback((origin, { name }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    try {
        //@ts-ignore
        const nameResult = name.result as string;
        if (!nameResult) {
            // Show form version.
            return islandVisitForm(player)
        }
        const island = Island.loadSync(nameResult)
        if (!island) return player.error("Island is offline or does not exist.")
        if (island.isBanned(player.xuid)) return player.error("You are banned from this island.")
        if (island.getStatus() === false && !island.isMember(player.xuid)) return player.error("This island is locked to visitors.")
        if (!island.teleport(player)) return;
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
