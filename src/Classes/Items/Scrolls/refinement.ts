import { CustomItemType, ItemIdentifier } from "@serenityjs/core";
import { Scroll } from "./base";
import { ScrollIdentifier } from "../../../Types/types";

const RefinementScrollType = new CustomItemType("scroll:refinement", { isComponentBased: true })
RefinementScrollType.components.setIcon({ default: "guster_banner_pattern" })

class RefinementScroll extends Scroll {
    public static readonly identifier = RefinementScrollType.identifier as ItemIdentifier;
    public static readonly scrollType = ScrollIdentifier.Refinement;

    constructor(amount: number = 1) {
        super(
            RefinementScroll.identifier,
            RefinementScroll.scrollType,
            "Refinement Scroll",
            [
                "§r§bIncreases the level of a CE",
                "§r§bon an item up to level 6.",
                "§r§dUse /refine on equipment."
            ],
        );
        this.stackSize = amount;
    }
}

export { RefinementScroll, RefinementScrollType };