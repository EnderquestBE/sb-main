import { EnchantmentRarity, WeightedItem } from "../../Types/types";
import { giveItemStack, giveMoney, giveXp, StashLoot } from "./loot";
import { WeightedSelector } from "../../Utils/weightedSelection";
import { SealedTome } from "../../Classes/Items/sealedTome";
import { CommonCrateKey, SeasonalCrateKey } from "../../Classes";

const RareStashLoot: WeightedItem<StashLoot>[] = [
    { value: { function: giveMoney, amount: [10000, 20000] }, weight: 25 },
    { value: { function: giveXp, amount: [200, 400] }, weight: 30 },
    { value: { function: giveItemStack.bind({ item: () => SealedTome, args: [EnchantmentRarity.Common] }), amount: [1, 1] }, weight: 15 },
    { value: { function: giveItemStack.bind({ item: () => SealedTome, args: [EnchantmentRarity.Rare] }), amount: [1, 1] }, weight: 20 },
    { value: { function: giveItemStack.bind({ item: () => SealedTome, args: [EnchantmentRarity.Legendary] }), amount: [1, 1] }, weight: 10 },
    { value: { function: giveItemStack.bind({ item: () => CommonCrateKey, args: [] }), amount: [1, 3] }, weight: 20 },
    //{ value: { function: giveItemStack.bind({ item: () => SeasonalCrateKey, args: [new Date(1762214400000)] }), amount: [1, 2] }, weight: 40 }
];

const RareStashSelector = new WeightedSelector(RareStashLoot);

export { RareStashLoot, RareStashSelector };