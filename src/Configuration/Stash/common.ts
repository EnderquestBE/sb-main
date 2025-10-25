import { EnchantmentRarity, WeightedItem } from "../../Types/types";
import { giveItemStack, giveMoney, giveXp, StashLoot } from "./loot";
import { WeightedSelector } from "../../Utils/weightedSelection";
import { SealedTome } from "../../Classes/Items/sealedTome";
import { CommonCrateKey, SeasonalCrateKey } from "../../Classes";

const CommonStashLoot: WeightedItem<StashLoot>[] = [
    { value: { function: giveMoney, amount: [2500, 10000] }, weight: 25 },
    { value: { function: giveXp, amount: [50, 200] }, weight: 20 },
    { value: { function: giveItemStack.bind({ item: () => SealedTome, args: [EnchantmentRarity.Common] }), amount: [1, 1] }, weight: 10 },
    { value: { function: giveItemStack.bind({ item: () => SealedTome, args: [EnchantmentRarity.Rare] }), amount: [1, 1] }, weight: 5 },
    { value: { function: giveItemStack.bind({ item: () => CommonCrateKey, args: [] }), amount: [1, 1] }, weight: 5 },
    { value: { function: giveItemStack.bind({ item: () => SeasonalCrateKey, args: [new Date(1762214400000)] }), amount: [1, 1] }, weight: 20 }
];

const CommonStashSelector = new WeightedSelector(CommonStashLoot);

export { CommonStashLoot, CommonStashSelector };