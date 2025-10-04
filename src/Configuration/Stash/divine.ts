import { EnchantmentRarity, WeightedItem } from "../../Types/types";
import { giveItemStack, giveMoney, giveXp, StashLoot } from "./loot";
import { WeightedSelector } from "../../Utils/weightedSelection";
import { SealedTome } from "../../Classes/Items/sealedTome";
import { DivineCrateKey, LegendaryCrateKey } from "../../Classes";

const DivineStashLoot: WeightedItem<StashLoot>[] = [
    { value: { function: giveMoney, amount: [30000, 35000] }, weight: 25 },
    { value: { function: giveXp, amount: [600, 700] }, weight: 30 },
    { value: { function: giveItemStack.bind({ item: () => SealedTome, args: [EnchantmentRarity.Legendary] }), amount: [1, 1] }, weight: 5 },
    { value: { function: giveItemStack.bind({ item: () => SealedTome, args: [EnchantmentRarity.Exotic] }), amount: [1, 1] }, weight: 65 },
    { value: { function: giveItemStack.bind({ item: () => LegendaryCrateKey, args: [] }), amount: [1, 2] }, weight: 20 },
    { value: { function: giveItemStack.bind({ item: () => DivineCrateKey, args: [] }), amount: [1, 1] }, weight: 15 },
];

const DivineStashSelector = new WeightedSelector(DivineStashLoot);

export { DivineStashLoot, DivineStashSelector };