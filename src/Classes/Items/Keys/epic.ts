import { CustomItemType, ItemIdentifier } from "@serenityjs/core";
import { CrateKey } from "./base";
import { CrateIdentifier } from "../../../Types/types";
import { ItemCustomCrateKeyTrait } from "../../../Traits/Item/traits";

const EpicCrateKeyType = new CustomItemType("cratekey:epic", {
  isComponentBased: true,
});
EpicCrateKeyType.components.setIcon({ default: "spawn_egg_endermite" });
EpicCrateKeyType.registerTrait(ItemCustomCrateKeyTrait);

class EpicCrateKey extends CrateKey {
  public static readonly identifier =
    EpicCrateKeyType.identifier as ItemIdentifier;
  public static readonly crateType = CrateIdentifier.Epic;

  constructor(amount: number = 1) {
    super(EpicCrateKey.identifier, EpicCrateKey.crateType, "§5Epic");
    this.setStackSize(amount);
  }
}

export { EpicCrateKey, EpicCrateKeyType };
