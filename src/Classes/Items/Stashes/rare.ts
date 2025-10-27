import { CustomItemType, ItemIdentifier } from "@serenityjs/core";
import { ItemCustomStashTrait } from "../../../Traits/Item/traits";
import { StashItem } from "./base";
import { StashIdentifier } from "../../../Types/Stashes/identifier";

const RareStashType = new CustomItemType("stash:rare", { isComponentBased: true })
RareStashType.components.setIcon({ default: "bundle_cyan" })
RareStashType.registerTrait(ItemCustomStashTrait)

class RareStash extends StashItem {
    public static readonly identifier = RareStashType.identifier as ItemIdentifier;
    public static readonly StashType = StashIdentifier.Rare;

    constructor(amount: number = 1) {
        super(
            RareStash.identifier,
            RareStash.StashType,
            "§bRare",
        );
        this.stackSize = amount;
    }
}

export { RareStash, RareStashType };