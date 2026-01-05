import { CustomItemType, ItemIdentifier } from "@serenityjs/core";
import { Scroll } from "./base";
import { ScrollIdentifier } from "../../../Types/types";

const MasteryScrollType = new CustomItemType("scroll:mastery", {
  isComponentBased: true,
});
MasteryScrollType.components.setIcon({ default: "flower_banner_pattern" });

class MasteryScroll extends Scroll {
  public static readonly identifier = "scroll:mastery" as ItemIdentifier;
  public static readonly scrollType = ScrollIdentifier.Mastery;

  constructor(amount: number = 1) {
    super(
      MasteryScroll.identifier,
      MasteryScroll.scrollType,
      "Mastery Scroll",
      [
        "§r§bIncreases the level of a CE",
        "§r§bon an item up to level 10.",
        "§r§dUse /master on equipment.",
      ]
    );
    this.setStackSize(amount);
  }
}

export { MasteryScroll, MasteryScrollType };
