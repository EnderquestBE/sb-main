import { ItemIdentifier } from "@serenityjs/core";

interface SellableItem {
    money?: number;
    xp?: number;
}

const SellableItems = new Map<ItemIdentifier, SellableItem>([
    /* Ores */
    [ItemIdentifier.Cobblestone, { money: 50, xp: 5 }],
    [ItemIdentifier.Netherrack, { money: 50, xp: 5 }],
    [ItemIdentifier.Coal, { money: 40, xp: 4 }],
    [ItemIdentifier.IronIngot, { money: 60, xp: 6 }],
    [ItemIdentifier.GoldIngot, { money: 80, xp: 8 }],
    [ItemIdentifier.LapisLazuli, { money: 90, xp: 9 }],
    [ItemIdentifier.Emerald, { money: 95, xp: 9.5 }],
    [ItemIdentifier.Diamond, { money: 100, xp: 10 }],

    /* Ore Blocks */
    [ItemIdentifier.CoalBlock, { money: 400, xp: 40 }],
    [ItemIdentifier.IronBlock, { money: 600, xp: 60 }],
    [ItemIdentifier.GoldBlock, { money: 800, xp: 80 }],
    [ItemIdentifier.LapisBlock, { money: 900, xp: 90 }],
    [ItemIdentifier.EmeraldBlock, { money: 950, xp: 95 }],
    [ItemIdentifier.DiamondBlock, { money: 1000, xp: 100 }],

    /* Crops */
    [ItemIdentifier.Beetroot, { money: 20, xp: 2 }],
    [ItemIdentifier.Wheat, { money: 25, xp: 2.5 }],
    [ItemIdentifier.Carrot, { money: 30, xp: 3 }],
    [ItemIdentifier.Potato, { money: 35, xp: 3.5 }],
    [ItemIdentifier.BakedPotato, { money: 40, xp: 4 }],
    [ItemIdentifier.Cactus, { money: 40, xp: 4 }],
    [ItemIdentifier.Pumpkin, { money: 75, xp: 7.5 }],
    [ItemIdentifier.MelonSlice, { money: 80, xp: 8 }],
    [ItemIdentifier.MelonBlock, { money: 720, xp: 72 }],

    /* Spawn Drops */
    [ItemIdentifier.RottenFlesh, { money: 25, xp: 2.5 }],
    [ItemIdentifier.Porkchop, { money: 30, xp: 3 }],
    [ItemIdentifier.CookedPorkchop, { money: 40, xp: 4 }],
    [ItemIdentifier.Chicken, { money: 30, xp: 3 }],
    [ItemIdentifier.CookedChicken, { money: 40, xp: 4 }],
    [ItemIdentifier.Feather, { money: 50, xp: 5 }],
    [ItemIdentifier.Beef, { money: 40, xp: 4 }],
    [ItemIdentifier.CookedBeef, { money: 50, xp: 5 }],
    [ItemIdentifier.Leather, { money: 50, xp: 5 }],
    [ItemIdentifier.String, { money: 60, xp: 6 }],
    [ItemIdentifier.SpiderEye, { money: 30, xp: 3 }],
    [ItemIdentifier.Gunpowder, { money: 60, xp: 6 }],
    [ItemIdentifier.Arrow, { money: 50, xp: 5 }],
    [ItemIdentifier.InkSac, { money: 60, xp: 6 }],
    [ItemIdentifier.Poppy, { money: 25, xp: 2.5 }],
    [ItemIdentifier.BlazeRod, { money: 80, xp: 8 }],

    /* Misc */
    [ItemIdentifier.OakLog, { money: 50 }],

    /* Admin */
    [ItemIdentifier.YellowShulkerBox, { money: 10000000, xp: 1000000 }]
]);

export { SellableItems };