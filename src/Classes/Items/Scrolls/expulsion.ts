import { CustomItemType, ItemIdentifier } from "@serenityjs/core";
import { Scroll } from "./base";
import { ScrollIdentifier } from "../../../Types/types";

const ExpulsionScrollType = new CustomItemType("scroll:expulsion", {
  isComponentBased: true,
});
ExpulsionScrollType.components.setIcon({ default: "skull_banner_pattern" });

class ExpulsionScroll extends Scroll {
  public static readonly identifier =
    ExpulsionScrollType.identifier as ItemIdentifier;
  public static readonly scrollType = ScrollIdentifier.Expulsion;

  constructor(amount: number = 1) {
    super(
      ExpulsionScroll.identifier,
      ExpulsionScroll.scrollType,
      "Expulsion Scroll",
      [
        "§r§bRemoves an enchantment from item",
        "§r§bwith a §c50%§b chance to recover the tome.",
        "§r§dUse /expel on equipment.",
      ]
    );
    this.setStackSize(amount);
  }
}

export { ExpulsionScroll, ExpulsionScrollType };
