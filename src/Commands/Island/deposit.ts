import { CustomEnum, Entity, IntegerEnum, StringEnum } from "@serenityjs/core";
import { CommandOverload, Island } from "../../Classes/classes";
import { Utils } from "../../Utils/utils";

class IslandDepositEnum extends CustomEnum {
    public static readonly identifier = "islandDeposit";
    public static options = ["deposit", "donate"];
}

const IslandDepositCommand = new CommandOverload({
    deposit: IslandDepositEnum,
    amount: IntegerEnum,
    island: [StringEnum, true]
}).onCallback((origin, { amount, island }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    //@ts-ignore
    let islandName: string | null = island.result
    if (islandName === null) islandName = player.getIslandName()
    const islandTarget = Island.loadSync(islandName)
    if (!islandTarget) return player.error("Island is offline or does not exist.")
    let depositAmount = amount.result
    if (depositAmount === null || depositAmount < 501) {
        player.error("Amount must be at least §e$500§c to deposit.")
        return
    }
    try {
        if (player.getMoney() < depositAmount) {
            player.error("You cannot afford to deposit this much.")
            return
        }
        const funds = islandTarget.getBankBalance()
        const max = islandTarget.getLimit("bank").max
        if (funds + depositAmount > max) {
            depositAmount = max - funds
            if (depositAmount < 501) {
                player.error("You have reached your island's bank limit.\n§dUse §e/is expand §dto increase it.")
                return
            }
        }
        islandTarget.depositToBank(depositAmount, `${player.username} deposited funds.`).then((result) => {
            if (result.success) {
                player.removeMoney(depositAmount!)
                player.info(`§e${islandTarget.isOwner(player.xuid) ? "Deposited" : "Donated"} §6$${Utils.formatInt(depositAmount!)} §eto §a${islandTarget.getName()}§e's bank funds!`)
            } else {
                player.error(result.reason ?? "Failed to deposit funds to island.")
                return
            }
        })
    } catch (e) {
        Island.logger.warn(
            "Error during island deposit for " + player.username + ": " + e
        );
    }
});

export { IslandDepositCommand };
