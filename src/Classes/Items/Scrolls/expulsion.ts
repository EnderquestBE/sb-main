import { ItemIdentifier } from "@serenityjs/core";
import { Scroll } from "./base";
import { ScrollIdentifier } from "../../../Types/types";

class ExpulsionScroll extends Scroll {
    public static readonly identifier = ItemIdentifier.SkullBannerPattern;
    public static readonly scrollType = ScrollIdentifier.Expulsion;

    constructor(amount: number = 1) {
        super(
            ExpulsionScroll.identifier,
            ExpulsionScroll.scrollType,
            "Expulsion Scroll",
            [
                "§r§bRemoves an enchantment from item",
                "§r§bwith a §c50%§b chance to recover the tome.",
                "§r§dUse /expel on equipment."
            ]
        );
        this.stackSize = amount;
    }
}

export { ExpulsionScroll };