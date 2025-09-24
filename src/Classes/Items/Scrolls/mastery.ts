import { ItemIdentifier } from "@serenityjs/core";
import { Scroll } from "./base";
import { ScrollIdentifier } from "../../../Types/types";

class MasteryScroll extends Scroll {
    public static readonly identifier = ItemIdentifier.FlowerBannerPattern;
    public static readonly scrollType = ScrollIdentifier.Mastery;

    constructor(amount: number = 1) {
        super(
            MasteryScroll.identifier,
            MasteryScroll.scrollType,
            "Mastery Scroll",
            [
                "§r§bIncreases the level of a CE",
                "§r§bon an item up to level 10.",
                "§r§dUse /master on equipment."
            ],
        );
        this.stackSize = amount;
    }
}

export { MasteryScroll };