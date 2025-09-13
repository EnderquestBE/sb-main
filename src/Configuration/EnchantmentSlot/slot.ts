import { ItemIdentifier } from "@serenityjs/core";

enum VanillaEnchantmentSlot {
    Pickaxe = "Pickaxe",
    Axe = "Axe",
    Shovel = "Shovel",
    Hoe = "Hoe",
    Tool = "Tool"
}

const EnchantmentSlot: { [key in VanillaEnchantmentSlot]: Set<ItemIdentifier> } = {
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
        ItemIdentifier.DiamondAxe,
        ItemIdentifier.WoodenShovel,
        ItemIdentifier.StoneShovel,
        ItemIdentifier.IronShovel,
        ItemIdentifier.GoldenShovel,
        ItemIdentifier.DiamondShovel
    ])
}

export { EnchantmentSlot, VanillaEnchantmentSlot }