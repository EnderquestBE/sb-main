import { EnchantmentRarity, WeightedItem } from "../../Types/types";
import { giveItemStack, giveMoney, giveXp, StashLoot } from "./loot";
import { WeightedSelector } from "../../Utils/weightedSelection";
import { SealedTome } from "../../Classes/Items/sealedTome";

const CommonStashLoot: WeightedItem<StashLoot>[] = [
    { value: { function: giveMoney, amount: [2500, 10000] }, weight: 25 },
    { value: { function: giveXp, amount: [50, 200] }, weight: 20 },
    { value: { function: giveItemStack.bind({ item: SealedTome, args: [EnchantmentRarity.Common] }), amount: [1, 1] }, weight: 15 },
    { value: { function: giveItemStack.bind({ item: SealedTome, args: [EnchantmentRarity.Rare] }), amount: [1, 1] }, weight: 5 },
];

const CommonStashSelector = new WeightedSelector(CommonStashLoot);

export { CommonStashLoot, CommonStashSelector };