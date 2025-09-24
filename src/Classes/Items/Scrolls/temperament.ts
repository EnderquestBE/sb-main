import { ItemIdentifier } from "@serenityjs/core";
import { Scroll } from "./base";
import { ScrollIdentifier } from "../../../Types/types";

class TemperamentScroll extends Scroll {
    public static readonly identifier = ItemIdentifier.FlowBannerPattern;
    public static readonly scrollType = ScrollIdentifier.Temperament;

    constructor(amount: number = 1) {
        super(
            TemperamentScroll.identifier,
            TemperamentScroll.scrollType,
            "Temperament Scroll",
            [
                "§r§bIncreases the level of a VE",
                "§r§bon an item up to level 10.",
                "§r§dUse /temper on equipment."
            ],
        );
        this.stackSize = amount;
    }
}

export { TemperamentScroll };