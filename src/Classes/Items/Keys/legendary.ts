import { CustomItemType, ItemIdentifier } from "@serenityjs/core";
import { CrateKey } from "./base";
import { CrateIdentifier } from "../../../Types/types";
import { ItemCustomCrateKeyTrait } from "../../../Traits/Item/traits";

const LegendaryCrateKeyType = new CustomItemType("cratekey:legendary", { isComponentBased: true })
LegendaryCrateKeyType.components.setIcon({ default: "spawn_egg_bee" })
LegendaryCrateKeyType.registerTrait(ItemCustomCrateKeyTrait)

class LegendaryCrateKey extends CrateKey {
    public static readonly identifier = LegendaryCrateKeyType.identifier as ItemIdentifier;
    public static readonly crateType = CrateIdentifier.Legendary;

    constructor(amount: number = 1) {
        super(
            LegendaryCrateKey.identifier,
            LegendaryCrateKey.crateType,
            "§eLegendary",
        );
        this.setStackSize(amount);
    }
}

export { LegendaryCrateKey, LegendaryCrateKeyType };