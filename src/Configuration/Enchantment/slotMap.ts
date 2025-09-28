import { Enchantment } from "@serenityjs/protocol";
import { EnchantmentSlotType } from "../EnchantmentSlot/slot";

const EnchantmentSlotMap: Map<Enchantment, EnchantmentSlotType[]> = new Map([
    [Enchantment.Efficiency, [EnchantmentSlotType.Pickaxe, EnchantmentSlotType.Axe, EnchantmentSlotType.Shovel, EnchantmentSlotType.Hoe]],
    [Enchantment.Unbreaking, [EnchantmentSlotType.Pickaxe, EnchantmentSlotType.Axe, EnchantmentSlotType.Shovel, EnchantmentSlotType.Hoe, EnchantmentSlotType.Sword, EnchantmentSlotType.Helmet, EnchantmentSlotType.Chestplate, EnchantmentSlotType.Leggings, EnchantmentSlotType.Boots]],
    [Enchantment.Fortune, [EnchantmentSlotType.Pickaxe, EnchantmentSlotType.Axe, EnchantmentSlotType.Shovel, EnchantmentSlotType.Hoe]],
    [Enchantment.BaneOfArthropods, [EnchantmentSlotType.Sword]],
    [Enchantment.FireAspect, [EnchantmentSlotType.Sword]],
    [Enchantment.Looting, [EnchantmentSlotType.Sword]],
    [Enchantment.Smite, [EnchantmentSlotType.Sword]],
    [Enchantment.Sharpness, [EnchantmentSlotType.Sword]],
])

export { EnchantmentSlotMap }