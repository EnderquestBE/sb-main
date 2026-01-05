import { CustomItemType, ItemIdentifier } from "@serenityjs/core";
import { CrateKey } from "./base";
import { CrateIdentifier } from "../../../Types/types";
import { ItemCustomCrateKeyTrait } from "../../../Traits/Item/traits";

const DivineCrateKeyType = new CustomItemType("cratekey:divine", {
  isComponentBased: true,
});
DivineCrateKeyType.components.setIcon({ default: "spawn_egg_parrot" });
DivineCrateKeyType.registerTrait(ItemCustomCrateKeyTrait);

class DivineCrateKey extends CrateKey {
  public static readonly identifier =
    DivineCrateKeyType.identifier as ItemIdentifier;
  public static readonly crateType = CrateIdentifier.Divine;

  constructor(amount: number = 1) {
    super(DivineCrateKey.identifier, DivineCrateKey.crateType, "§l§cDivine");
    this.setStackSize(amount);
  }
}

export { DivineCrateKey, DivineCrateKeyType };
