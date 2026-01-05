import { CustomItemType, ItemIdentifier } from "@serenityjs/core";
import { ItemCustomStashTrait } from "../../../Traits/Item/traits";
import { StashItem } from "./base";
import { StashIdentifier } from "../../../Types/Stashes/identifier";

const EpicStashType = new CustomItemType("stash:epic", {
  isComponentBased: true,
});
EpicStashType.components.setIcon({ default: "bundle_purple" });
EpicStashType.registerTrait(ItemCustomStashTrait);

class EpicStash extends StashItem {
  public static readonly identifier =
    EpicStashType.identifier as ItemIdentifier;
  public static readonly StashType = StashIdentifier.Epic;

  constructor(amount: number = 1) {
    super(EpicStash.identifier, EpicStash.StashType, "§5Epic");
    this.setStackSize(amount);
  }
}

export { EpicStash, EpicStashType };
