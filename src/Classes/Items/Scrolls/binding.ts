import { ItemIdentifier } from "@serenityjs/core";
import { Scroll } from "./base";
import { ScrollIdentifier } from "../../../Types/types";

class BindingScroll extends Scroll {
    public static readonly identifier = ItemIdentifier.BordureIndentedBannerPattern;
    public static readonly scrollType = ScrollIdentifier.Binding;

    constructor(amount: number = 1) {
        super(
            BindingScroll.identifier,
            BindingScroll.scrollType,
            "Binding Scroll",
            [
                "§r§bIncreases the strength of an",
                "§r§benchantment tome.",
                "§r§dUse /binding on an open tome."
            ],
        );
        this.stackSize = amount;
    }
}

export { BindingScroll };