import { EnchantmentRarity, WeightedItem } from "../../Types/types";
import { giveItemStack, giveMoney, giveXp, StashLoot } from "./loot";
import { WeightedSelector } from "../../Utils/weightedSelection";
import { SealedTome } from "../../Classes/Items/sealedTome";

const EpicStashLoot: WeightedItem<StashLoot>[] = [
    { value: { function: giveMoney, amount: [20000, 30000] }, weight: 25 },
    { value: { function: giveXp, amount: [400, 600] }, weight: 30 },
    { value: { function: giveItemStack.bind({ item: SealedTome, args: [EnchantmentRarity.Rare] }), amount: [1, 1] }, weight: 25 },
    { value: { function: giveItemStack.bind({ item: SealedTome, args: [EnchantmentRarity.Legendary] }), amount: [1, 1] }, weight: 20 },
    { value: { function: giveItemStack.bind({ item: SealedTome, args: [EnchantmentRarity.Exotic] }), amount: [1, 1] }, weight: 2 },
];

const EpicStashSelector = new WeightedSelector(EpicStashLoot);

export { EpicStashLoot, EpicStashSelector };