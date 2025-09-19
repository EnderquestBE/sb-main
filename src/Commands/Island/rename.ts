import { CustomEnum, Entity, StringEnum } from "@serenityjs/core";
import { CommandOverload, Island, IslandDatabase } from "../../Classes/classes";
import { Utils, validifyIslandName } from "../../Utils/utils";

class IslandRenameEnum extends CustomEnum {
    public static readonly identifier = "islandRename";
    public static options = ["rename"];
}

const ISLAND_RENAME_COST = 75000;

const IslandRenameCommand = new CommandOverload({
    rename: IslandRenameEnum,
    name: StringEnum
}).onCallback((origin, { name }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    try {
        const island = player.getIsland()
        if (!island)
            return player.error(
                `You don't have an island! Use /is create <name> to create one.`
            );

        if (island.getBankBalance() < ISLAND_RENAME_COST) {
            return player.error(`You need §6$${Utils.formatInt(ISLAND_RENAME_COST)} §cto rename your island.\n§6Deposit money in your island bank with §e/is §ddeposit§6.`);
        }

        const newName = name.result!;
        validifyIslandName(newName, IslandDatabase.instance).then((validation) => {
            if (!validation.success) {
                return player.error(validation.message!);
            }
            island.withdrawFromBank(ISLAND_RENAME_COST, `§7Renamed island to §6${newName}§7.`).then((result) => {
                if (!result.success) {
                    return player.error(result.reason!);
                }
                island.setName(newName).then((result) => {
                    if (!result.success) {
                        // Refund cost if rename failed.
                        island.depositToBank(ISLAND_RENAME_COST, "§7Refund: Failed to rename.");
                        return player.error(result.reason!);
                    }
                    player.info(`§aSuccessfully renamed your island to §e${newName}§a.`);
                })
            })
        })

    } catch (e) {
        Island.logger.warn(
            "Error during island rename for " + player.username + ": " + e
        );
    }
});

export { IslandRenameCommand };