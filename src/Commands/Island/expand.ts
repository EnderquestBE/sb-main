import { CustomEnum, Entity, MessageForm } from "@serenityjs/core";
import { CommandOverload, Island } from "../../Classes";
import { Utils } from "../../Utils/utils";
import { Expansion } from "../../Handlers";

class IslandExpandEnum extends CustomEnum {
    public static readonly identifier = "islandExpand";
    public static options = ["expand"];
}

const IslandExpandCommand = new CommandOverload({
    expand: IslandExpandEnum,
}).onCallback((origin) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    try {
        const island = player.getIsland()
        if (!island)
            return player.error(
                `You don't have an island! Use /is create <name> to create one.`
            );

        const size = island.getSize()
        const level = island.getLevel()
        const funds = island.getBankBalance()

        const reqPrice = Expansion.getUpgradeCost(size)
        const reqLevel = Expansion.getLevelRequirement(size);

        if (reqLevel > level) {
            return player.error(
                `Your island does not meet the requirements to expand. §eRequired Island Level: §6${reqLevel}\n§6Level up your island by §cmining§6, §afarming§6, and §bplacing §6blocks!`
            );
        }
        else if (reqPrice > funds) {
            return player.error(
                `Your island does not meet the requirements to expand. §eRequired Island Funds: §6$${Utils.formatInt(reqPrice)}\n§6Deposit money in your island bank with §e/is §ddeposit§6.`
            )
        }

        const form = new MessageForm("Expansion Confirmation");
        form.content = `Are you sure you want to upgrade your island?\n§7» §9Level: §b${level}\n§7» §6Price: §c$${Utils.formatInt(reqPrice)}\n§7» §eYour Balance: §6$${Utils.formatInt(funds)}`
        form.button1 = "Confirm"
        form.button2 = "Cancel"
        form.show(player, (result, error) => {
            if (error || !result) return
            Expansion.expand(island)
        })
    } catch (e) {
        Island.logger.warn(
            "Failed to show island expansion for " + player.username + ": " + e
        );
    }
});

export { IslandExpandCommand };
