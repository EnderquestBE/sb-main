import { ItemIdentifier } from "@serenityjs/core";

enum EnchantmentSlotType {
    Sword = "Sword",
    Pickaxe = "Pickaxe",
    Axe = "Axe",
    Shovel = "Shovel",
    Hoe = "Hoe",
    Tool = "Tool",
    Helmet = "Helmet",
    Chestplate = "Chestplate",
    Leggings = "Leggings",
    Boots = "Boots",
    Armor = "Armor"
}

const EnchantmentSlot: { [key in EnchantmentSlotType]: Set<ItemIdentifier> } = {
    Sword: new Set([
        ItemIdentifier.WoodenSword,
        ItemIdentifier.StoneSword,
        ItemIdentifier.IronSword,
        ItemIdentifier.GoldenSword,
        ItemIdentifier.DiamondSword
    ]),
    Pickaxe: new Set([
        ItemIdentifier.WoodenPickaxe,
        ItemIdentifier.StonePickaxe,
        ItemIdentifier.IronPickaxe,
        ItemIdentifier.GoldenPickaxe,
        ItemIdentifier.DiamondPickaxe
    ]),
    Axe: new Set([
        ItemIdentifier.WoodenAxe,
        ItemIdentifier.StoneAxe,
        ItemIdentifier.IronAxe,
        ItemIdentifier.GoldenAxe,
        ItemIdentifier.DiamondAxe
    ]),
    Shovel: new Set([
        ItemIdentifier.WoodenShovel,
        ItemIdentifier.StoneShovel,
        ItemIdentifier.IronShovel,
        ItemIdentifier.GoldenShovel,
        ItemIdentifier.DiamondShovel
    ]),
    Hoe: new Set([
        ItemIdentifier.WoodenHoe,
        ItemIdentifier.StoneHoe,
        ItemIdentifier.IronHoe,
        ItemIdentifier.GoldenHoe,
        ItemIdentifier.DiamondHoe
    ]),
    Tool: new Set([
        ItemIdentifier.WoodenPickaxe,
        ItemIdentifier.StonePickaxe,
        ItemIdentifier.IronPickaxe,
        ItemIdentifier.GoldenPickaxe,
        ItemIdentifier.DiamondPickaxe,
        ItemIdentifier.WoodenAxe,
        ItemIdentifier.StoneAxe,
        ItemIdentifier.IronAxe,
        ItemIdentifier.GoldenAxe,
        ItemIdentifier.DiamondAxe
    ]),
    Helmet: new Set([
        ItemIdentifier.LeatherHelmet,
        ItemIdentifier.ChainmailHelmet,
        ItemIdentifier.IronHelmet,
        ItemIdentifier.GoldenHelmet,
        ItemIdentifier.DiamondHelmet
    ]),
    Chestplate: new Set([
        ItemIdentifier.LeatherChestplate,
        ItemIdentifier.ChainmailChestplate,
        ItemIdentifier.IronChestplate,
        ItemIdentifier.GoldenChestplate,
        ItemIdentifier.DiamondChestplate
    ]),
    Leggings: new Set([
        ItemIdentifier.LeatherLeggings,
        ItemIdentifier.ChainmailLeggings,
        ItemIdentifier.IronLeggings,
        ItemIdentifier.GoldenLeggings,
        ItemIdentifier.DiamondLeggings
    ]),
    Boots: new Set([
        ItemIdentifier.LeatherBoots,
        ItemIdentifier.ChainmailBoots,
        ItemIdentifier.IronBoots,
        ItemIdentifier.GoldenBoots,
        ItemIdentifier.DiamondBoots
    ]),
    Armor: new Set([
        ItemIdentifier.LeatherHelmet,
        ItemIdentifier.ChainmailHelmet,
        ItemIdentifier.IronHelmet,
        ItemIdentifier.GoldenHelmet,
        ItemIdentifier.DiamondHelmet,
        ItemIdentifier.LeatherChestplate,
        ItemIdentifier.ChainmailChestplate,
        ItemIdentifier.IronChestplate,
        ItemIdentifier.GoldenChestplate,
        ItemIdentifier.DiamondChestplate,
        ItemIdentifier.LeatherLeggings,
        ItemIdentifier.ChainmailLeggings,
        ItemIdentifier.IronLeggings,
        ItemIdentifier.GoldenLeggings,
        ItemIdentifier.DiamondLeggings,
        ItemIdentifier.LeatherBoots,
        ItemIdentifier.ChainmailBoots,
        ItemIdentifier.IronBoots,
        ItemIdentifier.GoldenBoots,
        ItemIdentifier.DiamondBoots
    ])
}

export { EnchantmentSlot, EnchantmentSlotType }