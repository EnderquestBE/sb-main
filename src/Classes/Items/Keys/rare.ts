import { CustomItemType, ItemIdentifier } from "@serenityjs/core";
import { CrateKey } from "./base";
import { CrateIdentifier } from "../../../Types/types";
import { ItemCustomCrateKeyTrait } from "../../../Traits/Item/traits";

const RareCrateKeyType = new CustomItemType("cratekey:rare", {
    isComponentBased: true,
});
RareCrateKeyType.components.setIcon({ default: "spawn_egg_vex" });
RareCrateKeyType.registerTrait(ItemCustomCrateKeyTrait);

class RareCrateKey extends CrateKey {
    public static readonly identifier =
        RareCrateKeyType.identifier as ItemIdentifier;
    public static readonly crateType = CrateIdentifier.Rare;

    constructor(amount: number = 1) {
        super(RareCrateKey.identifier, RareCrateKey.crateType, "§bRare");
        this.setStackSize(amount);
    }
}

export { RareCrateKey, RareCrateKeyType };
