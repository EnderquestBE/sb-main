import { EnchantmentRarity, WeightedItem } from "../../Types/types";
import { CrateLoot, giveItem, giveItemStack, giveMoney } from "./loot";
import { WeightedSelector } from "../../Utils/weightedSelection";
import { ItemIdentifier, Player } from "@serenityjs/core";
import { LegendaryCrateKey, MasteryScroll, RefinementScroll, SealedTome, TemperamentScroll } from "../../Classes";
import { SpawnerEntity, SpawnerHandler } from "../../Handlers";

function randomSpawner(player: Player, amount: number) {
    const keys = SpawnerEntity.keys;
    const randomKey = keys[Math.floor(Math.random() * keys.length)]!;
    const item = SpawnerHandler.createItem(randomKey, 1, amount);
    player.inventory.addItem(item);
    return `a ${item.getDisplayName()}`
}


const DivineCrateLoot: WeightedItem<CrateLoot>[] = [
    { value: { function: giveItem.bind({ id: ItemIdentifier.LapisBlock, display: "§6Lapis Block §8x§c128" }), amount: 128 }, weight: 5 },
    { value: { function: giveItem.bind({ id: ItemIdentifier.DiamondBlock, display: "§6Diamond Block §8x§c128" }), amount: 128 }, weight: 10 },
    { value: { function: giveItem.bind({ id: ItemIdentifier.Bedrock, display: "§6Bedrock §8x§c128" }), amount: 128 }, weight: 5 },
    { value: { function: giveItem.bind({ id: ItemIdentifier.QuartzBlock, display: "§6Quartz Block §8x§c256" }), amount: 256 }, weight: 10 },
    { value: { function: giveMoney, amount: 60000 }, weight: 5 },
    { value: { function: giveMoney, amount: 90000 }, weight: 10 },
    { value: { function: giveItemStack.bind({ item: () => LegendaryCrateKey, args: [] }), amount: 3 }, weight: 10 },
    { value: { function: giveItemStack.bind({ item: () => RefinementScroll, args: [] }), amount: 3 }, weight: 10 },
    { value: { function: giveItemStack.bind({ item: () => TemperamentScroll, args: [] }), amount: 3 }, weight: 10 },
    { value: { function: giveItemStack.bind({ item: () => MasteryScroll, args: [] }), amount: 3 }, weight: 10 },
    { value: { function: giveItemStack.bind({ item: () => MasteryScroll, args: [] }), amount: 2 }, weight: 5 },
    { value: { function: giveItemStack.bind({ item: () => SealedTome, args: [EnchantmentRarity.Exotic] }), amount: 1 }, weight: 5 },
    { value: { function: giveItemStack.bind({ item: () => SealedTome, args: [EnchantmentRarity.Exotic] }), amount: 2 }, weight: 5 },
    { value: { function: randomSpawner, amount: 1 }, weight: 10 }
];

const DivineCrateSelector = new WeightedSelector(DivineCrateLoot);

export { DivineCrateLoot, DivineCrateSelector };