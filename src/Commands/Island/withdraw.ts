import { CustomEnum, Entity, IntegerEnum } from "@serenityjs/core";
import { CommandOverload, Island } from "../../Classes";
import { Utils } from "../../Utils/utils";

class IslandWithdrawEnum extends CustomEnum {
    public static readonly identifier = "islandWithdraw";
    public static options = ["withdraw"];
}

const IslandWithdrawCommand = new CommandOverload({
    withdraw: IslandWithdrawEnum,
    amount: IntegerEnum
}).onCallback((origin, { amount }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    let withdrawAmount = amount.result
    if (withdrawAmount === null || withdrawAmount < 501) {
        player.error("Amount must be at least §e$500§c to withdraw.")
        return
    }
    try {
        const island = player.getIsland()
        if (!island)
            return player.error(
                `You don't have an island! Use /is create <name> to create one.`
            );

        if (withdrawAmount > island.getBankBalance() && island.getBankBalance() > 501) {
            withdrawAmount = island.getBankBalance()
        }

        island.withdrawFromBank(withdrawAmount, `${player.username} withdrew funds.`).then((result) => {
            if (result.success) {
                player.addMoney(withdrawAmount!)
                player.info(`§eWithdrawn §6$${Utils.formatInt(withdrawAmount!)} §efrom §a${island.getName()}§e's bank funds!`)
            } else {
                player.error(result.reason ?? "Failed to withdraw funds from island.")
                return
            }
        })
    } catch (e) {
        Island.logger.warn(
            "Error during island withdrawl for " + player.username + ": " + e
        );
    }
});

export { IslandWithdrawCommand };
