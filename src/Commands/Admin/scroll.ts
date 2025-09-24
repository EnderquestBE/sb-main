import { CustomEnum, IntegerEnum, Player } from "@serenityjs/core";
import {
    BindingScroll,
    CommandBuilder,
    CommandOverload,
    ExpulsionScroll,
    MasteryScroll,
    RefinementScroll,
    RestorationScroll,
    TemperamentScroll,
    Scroll
} from "../../Classes";
import { ScrollIdentifier } from "../../Types/types";

// Enum for the scroll types
class ScrollTypeEnum extends CustomEnum {
    public static readonly identifier = "scrollTypeEnum";
    public static options = Object.values(ScrollIdentifier);
}

new CommandBuilder("scroll", "Gives the player a specified scroll.")
    .setPermissions(["serenity.operator"])
    .addOverload(
        new CommandOverload({
            type: ScrollTypeEnum,
            amount: [IntegerEnum, true],
        }).onCallback((origin, { type, amount }) => {
            if (!(origin instanceof Player)) return;

            const player = origin;
            const scrollType = type.result as keyof typeof ScrollIdentifier;
            if (!scrollType) {
                return player.error("Scroll type is invalid.");
            }
            //@ts-ignore
            const amountValue = amount?.result ?? 1;

            if (amountValue < 1) {
                return player.error("Amount must be at least 1.");
            }

            let scrollItem: Scroll | null = null;

            switch (scrollType) {
                case "Binding":
                    scrollItem = new BindingScroll(amountValue);
                    break;
                case "Refinement":
                    scrollItem = new RefinementScroll(amountValue);
                    break;
                case "Mastery":
                    scrollItem = new MasteryScroll(amountValue);
                    break;
                case "Expulsion":
                    scrollItem = new ExpulsionScroll(amountValue);
                    break;
                case "Temperament":
                    scrollItem = new TemperamentScroll(amountValue);
                    break;
                case "Restoration":
                    scrollItem = new RestorationScroll(amountValue);
                    break;
                default:
                    return player.error("Scroll type is invalid.");
            }

            if (scrollItem) {
                player.inventory.addItem(scrollItem);
                player.info(`§aGave you §e${amountValue}x ${scrollItem.getDisplayName()}§a.`);
            }
        })
    )
    .register("Admin");
