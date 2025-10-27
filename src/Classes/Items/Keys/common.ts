import { CustomItemType, ItemIdentifier } from "@serenityjs/core";
import { CrateKey } from "./base";
import { CrateIdentifier } from "../../../Types/types";
import { ItemCustomCrateKeyTrait } from "../../../Traits/Item/traits";

const CommonCrateKeyType = new CustomItemType("cratekey:common", { isComponentBased: true })
CommonCrateKeyType.components.setIcon({ default: "spawn_egg_chicken" })
CommonCrateKeyType.registerTrait(ItemCustomCrateKeyTrait)

class CommonCrateKey extends CrateKey {
    public static readonly identifier = CommonCrateKeyType.identifier as ItemIdentifier;
    public static readonly crateType = CrateIdentifier.Common;

    constructor(amount: number = 1) {
        super(
            CommonCrateKey.identifier,
            CommonCrateKey.crateType,
            "§fCommon",
        );
        this.stackSize = amount;
    }
}

export { CommonCrateKey, CommonCrateKeyType };