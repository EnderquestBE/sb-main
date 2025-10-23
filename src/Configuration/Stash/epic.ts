import { EnchantmentRarity, WeightedItem } from "../../Types/types";
import { giveItemStack, giveMoney, giveXp, StashLoot } from "./loot";
import { WeightedSelector } from "../../Utils/weightedSelection";
import { SealedTome } from "../../Classes/Items/sealedTome";
import { RareCrateKey, SeasonalCrateKey } from "../../Classes";

const EpicStashLoot: WeightedItem<StashLoot>[] = [
    { value: { function: giveMoney, amount: [20000, 30000] }, weight: 25 },
    { value: { function: giveXp, amount: [400, 600] }, weight: 30 },
    { value: { function: giveItemStack.bind({ item: () => SealedTome, args: [EnchantmentRarity.Rare] }), amount: [1, 1] }, weight: 25 },
    { value: { function: giveItemStack.bind({ item: () => SealedTome, args: [EnchantmentRarity.Legendary] }), amount: [1, 1] }, weight: 20 },
    { value: { function: giveItemStack.bind({ item: () => SealedTome, args: [EnchantmentRarity.Exotic] }), amount: [1, 1] }, weight: 2 },
    { value: { function: giveItemStack.bind({ item: () => RareCrateKey, args: [] }), amount: [1, 3] }, weight: 20 },
    { value: { function: giveItemStack.bind({ item: () => SeasonalCrateKey, args: [new Date(1761955200000)] }), amount: [1, 3] }, weight: 20 }
];

const EpicStashSelector = new WeightedSelector(EpicStashLoot);

export { EpicStashLoot, EpicStashSelector };