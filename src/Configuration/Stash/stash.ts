import { StashIdentifier } from "../../Types/Stashes/identifier";
import { WeightedItem } from "../../Types/types";
import { WeightedSelector } from "../../Utils/weightedSelection";

const StashChance: WeightedItem<StashIdentifier>[] = [
    { value: StashIdentifier.Common, weight: 63 },
    { value: StashIdentifier.Rare, weight: 25 },
    { value: StashIdentifier.Epic, weight: 7 },
    { value: StashIdentifier.Legendary, weight: 4 },
    { value: StashIdentifier.Divine, weight: 1 },
]

const StashSelector = new WeightedSelector(StashChance);

export { StashChance, StashSelector }