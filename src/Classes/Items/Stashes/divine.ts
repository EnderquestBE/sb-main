import { CustomItemType, ItemIdentifier } from "@serenityjs/core";
import { ItemCustomStashTrait } from "../../../Traits/Item/traits";
import { StashItem } from "./base";
import { StashIdentifier } from "../../../Types/Stashes/identifier";

const DivineStashType = new CustomItemType("stash:divine", {
  isComponentBased: true,
});
DivineStashType.components.setIcon({ default: "bundle_red" });
DivineStashType.registerTrait(ItemCustomStashTrait);

class DivineStash extends StashItem {
  public static readonly identifier =
    DivineStashType.identifier as ItemIdentifier;
  public static readonly StashType = StashIdentifier.Divine;

  constructor(amount: number = 1) {
    super(DivineStash.identifier, DivineStash.StashType, "§cDivine");
    this.setStackSize(amount);
  }
}

export { DivineStash, DivineStashType };
