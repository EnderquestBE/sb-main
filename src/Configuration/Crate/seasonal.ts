import { WeightedItem } from "../../Types/types";
import { CrateLoot, giveItem } from "./loot";
import { WeightedSelector } from "../../Utils/weightedSelection";
import { ItemIdentifier } from "@serenityjs/core";

const SeasonalCrateLoot: WeightedItem<CrateLoot>[] = [
    { value: { function: giveItem.bind({ id: ItemIdentifier.DiamondBlock, display: "§6Diamond Block §8x§c16" }), amount: 16 }, weight: 15 },
];

const SeasonalCrateSelector = new WeightedSelector(SeasonalCrateLoot);

export { SeasonalCrateLoot, SeasonalCrateSelector };