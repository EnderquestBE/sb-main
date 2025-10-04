import { EnchantmentRarity, WeightedItem } from "../../Types/types";
import { CrateLoot, giveItem, giveItemStack, giveMoney } from "./loot";
import { WeightedSelector } from "../../Utils/weightedSelection";
import { EntityIdentifier, ItemIdentifier, Player } from "@serenityjs/core";
import { DivineCrateKey, MasteryScroll, RareCrateKey, RefinementScroll, SealedTome, TemperamentScroll } from "../../Classes";
import { SpawnerHandler } from "../../Handlers";

function randomSpawner(player: Player, amount: number) {
    const keys = [EntityIdentifier.Zombie, EntityIdentifier.Pig, EntityIdentifier.Chicken, EntityIdentifier.Cow, EntityIdentifier.Spider];
    const randomKey = keys[Math.floor(Math.random() * keys.length)]!;
    const item = SpawnerHandler.createItem(randomKey, 1, amount);
    player.inventory.addItem(item);
    return `a ${item.getDisplayName()}`
}

const LegendaryCrateLoot: WeightedItem<CrateLoot>[] = [
    { value: { function: giveItem.bind({ id: ItemIdentifier.Apple, display: "§6Apple §8x§c32" }), amount: 32 }, weight: 5 },
    { value: { function: giveItem.bind({ id: ItemIdentifier.CoalBlock, display: "§6Coal Block §8x§c16" }), amount: 16 }, weight: 10 },
    { value: { function: giveItem.bind({ id: ItemIdentifier.IronBlock, display: "§6Iron Block §8x§c16" }), amount: 16 }, weight: 10 },
    { value: { function: giveItem.bind({ id: ItemIdentifier.GoldBlock, display: "§6Gold Block §8x§c16" }), amount: 16 }, weight: 5 },
    { value: { function: giveItem.bind({ id: ItemIdentifier.LapisBlock, display: "§6Lapis Block §8x§c16" }), amount: 16 }, weight: 5 },
    { value: { function: giveItem.bind({ id: ItemIdentifier.DiamondBlock, display: "§6Diamond Block §8x§c16" }), amount: 16 }, weight: 10 },
    { value: { function: giveItem.bind({ id: ItemIdentifier.Bedrock, display: "§6Bedrock §8x§c32" }), amount: 32 }, weight: 10 },
    { value: { function: giveItem.bind({ id: ItemIdentifier.QuartzBlock, display: "§6Quartz Block §8x§c64" }), amount: 64 }, weight: 10 },
    { value: { function: giveMoney, amount: 50000 }, weight: 10 },
    { value: { function: giveMoney, amount: 100000 }, weight: 10 },
    { value: { function: giveItemStack.bind({ item: () => RareCrateKey, args: [] }), amount: 2 }, weight: 5 },
    { value: { function: giveItemStack.bind({ item: () => DivineCrateKey, args: [] }), amount: 1 }, weight: 10 },
    { value: { function: giveItemStack.bind({ item: () => RefinementScroll, args: [] }), amount: 2 }, weight: 10 },
    { value: { function: giveItemStack.bind({ item: () => TemperamentScroll, args: [] }), amount: 2 }, weight: 10 },
    { value: { function: giveItemStack.bind({ item: () => TemperamentScroll, args: [] }), amount: 1 }, weight: 5 },
    { value: { function: giveItemStack.bind({ item: () => MasteryScroll, args: [] }), amount: 1 }, weight: 10 },
    { value: { function: giveItemStack.bind({ item: () => MasteryScroll, args: [] }), amount: 2 }, weight: 5 },
    { value: { function: giveItemStack.bind({ item: () => SealedTome, args: [EnchantmentRarity.Legendary] }), amount: 3 }, weight: 5 },
    { value: { function: randomSpawner, amount: 1 }, weight: 10 }
];

const LegendaryCrateSelector = new WeightedSelector(LegendaryCrateLoot);

export { LegendaryCrateLoot, LegendaryCrateSelector };