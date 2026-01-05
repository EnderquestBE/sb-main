import { CustomItemType, ItemIdentifier } from "@serenityjs/core";
import { CrateKey } from "./base";
import { CrateIdentifier } from "../../../Types/types";
import { ItemCustomCrateKeyTrait } from "../../../Traits/Item/traits";

const VoterCrateKeyType = new CustomItemType("cratekey:voter", {
  isComponentBased: true,
});
VoterCrateKeyType.components.setIcon({ default: "spawn_egg_cat" });
VoterCrateKeyType.registerTrait(ItemCustomCrateKeyTrait);

class VoterCrateKey extends CrateKey {
  public static readonly identifier =
    VoterCrateKeyType.identifier as ItemIdentifier;
  public static readonly crateType = CrateIdentifier.Voter;

  constructor(amount: number = 1) {
    super(VoterCrateKey.identifier, VoterCrateKey.crateType, "§aVoter");
    this.setStackSize(amount);
  }
}

export { VoterCrateKey, VoterCrateKeyType };
