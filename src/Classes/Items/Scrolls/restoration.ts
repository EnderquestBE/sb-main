import { ItemIdentifier } from "@serenityjs/core";
import { Scroll } from "./base";
import { ScrollIdentifier } from "../../../Types/types";

class RestorationScroll extends Scroll {
    public static readonly identifier = ItemIdentifier.PiglinBannerPattern;
    public static readonly scrollType = ScrollIdentifier.Restoration;

    constructor(amount: number = 1) {
        super(
            RestorationScroll.identifier,
            RestorationScroll.scrollType,
            "Restoration Scroll",
            [
                "§r§bRepairs equipment to full durability.",
                "§r§dUse /restore on equipment."
            ],
        );
        this.stackSize = amount;
    }
}

export { RestorationScroll };