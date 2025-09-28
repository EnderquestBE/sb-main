import { CustomItemType, ItemIdentifier } from "@serenityjs/core";
import { Scroll } from "./base";
import { ScrollIdentifier } from "../../../Types/types";

const BindingScrollType = new CustomItemType("scroll:binding", { isComponentBased: true })
BindingScrollType.components.setIcon({ default: "bordure_indented_banner_pattern" })

class BindingScroll extends Scroll {
    public static readonly identifier = BindingScrollType.identifier as ItemIdentifier;
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

export { BindingScroll, BindingScrollType };