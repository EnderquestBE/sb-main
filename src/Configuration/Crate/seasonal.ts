import { WeightedItem } from "../../Types/types";
import { CrateLoot, giveItem, giveItemStack, giveMoney } from "./loot";
import { WeightedSelector } from "../../Utils/weightedSelection";
import { ItemIdentifier } from "@serenityjs/core";
import { CommonCrateKey, MasteryScroll, RareCrateKey, RefinementScroll, VanityVoucher } from "../../Classes";

const SeasonalCrateLoot: WeightedItem<CrateLoot>[] = [
    { value: { function: giveItem.bind({ id: ItemIdentifier.OakLog, display: "§6Oak Log §8x§c32" }), amount: 32 }, weight: 5 },
    { value: { function: giveItem.bind({ id: ItemIdentifier.Apple, display: "§6Apple §8x§c16" }), amount: 16 }, weight: 5 },
    { value: { function: giveItem.bind({ id: ItemIdentifier.IronIngot, display: "§6Iron Ingot §8x§c32" }), amount: 32 }, weight: 5 },
    { value: { function: giveItem.bind({ id: ItemIdentifier.Diamond, display: "§6Diamond §8x§c16" }), amount: 16 }, weight: 10 },
    { value: { function: giveItem.bind({ id: ItemIdentifier.CoalBlock, display: "§6Coal Block §8x§c4" }), amount: 4 }, weight: 5 },
    { value: { function: giveItem.bind({ id: ItemIdentifier.IronBlock, display: "§6Iron Block §8x§c4" }), amount: 4 }, weight: 5 },
    { value: { function: giveItem.bind({ id: ItemIdentifier.GoldBlock, display: "§6Gold Block §8x§c4" }), amount: 4 }, weight: 10 },
    { value: { function: giveItem.bind({ id: ItemIdentifier.LapisBlock, display: "§6Lapis Block §8x§c4" }), amount: 4 }, weight: 10 },
    { value: { function: giveItem.bind({ id: ItemIdentifier.DiamondBlock, display: "§6Diamond Block §8x§c4" }), amount: 4 }, weight: 10 },
    { value: { function: giveItem.bind({ id: ItemIdentifier.QuartzBlock, display: "§6Quartz Block §8x§c16" }), amount: 16 }, weight: 10 },
    { value: { function: giveMoney, amount: 5000 }, weight: 10 },
    { value: { function: giveMoney, amount: 10000 }, weight: 10 },
    { value: { function: giveItemStack.bind({ item: () => CommonCrateKey, args: [] }), amount: 3 }, weight: 10 },
    { value: { function: giveItemStack.bind({ item: () => RareCrateKey, args: [] }), amount: 1 }, weight: 5 },
    { value: { function: giveItemStack.bind({ item: () => RefinementScroll, args: [] }), amount: 1 }, weight: 10 },
    { value: { function: giveItemStack.bind({ item: () => MasteryScroll, args: [] }), amount: 1 }, weight: 5 },
    { value: { function: giveItemStack.bind({ item: () => VanityVoucher, args: ["pig_mask"] }), amount: 1 }, weight: 10 },
    { value: { function: giveItemStack.bind({ item: () => VanityVoucher, args: ["zombie_mask"] }), amount: 1 }, weight: 10 },
    { value: { function: giveItemStack.bind({ item: () => VanityVoucher, args: ["skeleton_mask"] }), amount: 1 }, weight: 10 },
    { value: { function: giveItemStack.bind({ item: () => VanityVoucher, args: ["iron_golem_mask"] }), amount: 1 }, weight: 10 },
    { value: { function: giveItemStack.bind({ item: () => VanityVoucher, args: ["creeper_mask"] }), amount: 1 }, weight: 10 },
    { value: { function: giveItemStack.bind({ item: () => VanityVoucher, args: ["2025_candy_bucket"] }), amount: 1 }, weight: 5 }
];

const SeasonalCrateSelector = new WeightedSelector(SeasonalCrateLoot);

export { SeasonalCrateLoot, SeasonalCrateSelector };