import { CustomItemType, ItemIdentifier } from "@serenityjs/core";
import { ItemCustomStashTrait } from "../../../Traits/Item/traits";
import { StashItem } from "./base";
import { StashIdentifier } from "../../../Types/Stashes/identifier";

const LegendaryStashType = new CustomItemType("stash:legendary", { isComponentBased: true })
LegendaryStashType.components.setIcon({ default: "bundle_yellow" })
LegendaryStashType.registerTrait(ItemCustomStashTrait)

class LegendaryStash extends StashItem {
    public static readonly identifier = LegendaryStashType.identifier as ItemIdentifier;
    public static readonly StashType = StashIdentifier.Legendary;

    constructor(amount: number = 1) {
        super(
            LegendaryStash.identifier,
            LegendaryStash.StashType,
            "§eLegendary",
        );
        this.setStackSize(amount);
    }
}

export { LegendaryStash, LegendaryStashType };