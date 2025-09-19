import { CustomEnum, Entity } from "@serenityjs/core";
import { CommandOverload, Island } from "../../Classes/classes";
import { IslandPerkUnlocks } from "../../Handlers/Island/perks";

class IslandPerksEnum extends CustomEnum {
    public static readonly identifier = "islandPerks";
    public static options = ["perks"];
}

const bridgeTop = "=".repeat(19)
const bridgeBottom = "=".repeat(51)

const IslandPerksCommand = new CommandOverload({
    perks: IslandPerksEnum
}).onCallback((origin) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    try {
        const island = player.getIsland();
        if (!island)
            return player.error(
                `You don't have an island! Use /is create <name> to create one.`
            );

        const perks = IslandPerkUnlocks.getAll()

        player.sendMessage("§7" + bridgeTop + " §2ISLAND PERKS §f" + "§7" + bridgeTop);
        for (const perk of perks) {
            const unlocked = island.hasPerk(perk.id);
            player.sendMessage(`§7» §f${perk.name}§2[§6${perk.level}§2] §7- ${unlocked ? "§aUnlocked" : "§cLocked"}`);
        }
        player.sendMessage("§7" + bridgeBottom)

    } catch (e) {
        Island.logger.warn("Error showing island perks: " + e);
    }
});

export { IslandPerksCommand };