import { CustomItemType, ItemIdentifier } from "@serenityjs/core";
import { Scroll } from "./base";
import { ScrollIdentifier } from "../../../Types/types";

const RestorationScrollType = new CustomItemType("scroll:restoration", { isComponentBased: true })
RestorationScrollType.components.setIcon({ default: "piglin_banner_pattern" })

class RestorationScroll extends Scroll {
    public static readonly identifier = RestorationScrollType.identifier as ItemIdentifier;
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

export { RestorationScroll, RestorationScrollType };