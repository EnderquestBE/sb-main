import { CustomItemType, ItemIdentifier } from "@serenityjs/core";
import { ItemCustomStashTrait } from "../../../Traits/Item/traits";
import { StashItem } from "./base";
import { StashIdentifier } from "../../../Types/Stashes/identifier";

const CommonStashType = new CustomItemType("stash:common", {
  isComponentBased: true,
});
CommonStashType.components.setIcon({ default: "bundle_white" });
CommonStashType.registerTrait(ItemCustomStashTrait);

class CommonStash extends StashItem {
  public static readonly identifier =
    CommonStashType.identifier as ItemIdentifier;
  public static readonly StashType = StashIdentifier.Common;

  constructor(amount: number = 1) {
    super(CommonStash.identifier, CommonStash.StashType, "§fCommon");
    this.setStackSize(amount);
  }
}

export { CommonStash, CommonStashType };
