import { CustomEnum, IntegerEnum, Player } from "@serenityjs/core";
import {
    CommandBuilder,
    CommandOverload,
    CommonStash,
    DivineStash,
    EpicStash,
    LegendaryStash,
    RareStash,
    StashItem,
} from "../../Classes";
import { StashIdentifier } from "../../Types/Stashes/identifier";

// Enum for the Stash types
class StashTypeEnum extends CustomEnum {
    public static readonly identifier = "StashTypeEnum";
    public static options = Object.values(StashIdentifier);
}

new CommandBuilder("stash", "Gives the player a specified stash.")
    .setPermissions(["serenity.operator"])
    .addOverload(
        new CommandOverload({
            type: StashTypeEnum,
            amount: [IntegerEnum, true],
        }).onCallback((origin, { type, amount }) => {
            if (!(origin instanceof Player)) return;

            const player = origin;
            const StashType = type.result as keyof typeof StashIdentifier;
            if (!StashType) {
                return player.error("Stash type is invalid.");
            }
            //@ts-ignore
            const amountValue = amount?.result ?? 1;

            if (amountValue < 1) {
                return player.error("Amount must be at least 1.");
            }

            let StashItem: StashItem | null = null;

            switch (StashType) {
                case "Common":
                    StashItem = new CommonStash(amountValue);
                    break;
                case "Rare":
                    StashItem = new RareStash(amountValue);
                    break;
                case "Epic":
                    StashItem = new EpicStash(amountValue);
                    break;
                case "Legendary":
                    StashItem = new LegendaryStash(amountValue);
                    break;
                case "Divine":
                    StashItem = new DivineStash(amountValue);
                    break;
                default:
                    return player.error("Stash type is invalid.");
            }

            if (StashItem) {
                player.inventory.addItem(StashItem);
                player.info(`§aGave you §e${amountValue}x ${StashItem.getDisplayName()}§a.`);
            }
        })
    )
    .register("Admin");
