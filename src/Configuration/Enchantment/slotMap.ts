import { Enchantment } from "@serenityjs/protocol";
import { VanillaEnchantmentSlot } from "../EnchantmentSlot/slot";

const EnchantmentSlotMap: Map<Enchantment, VanillaEnchantmentSlot[]> = new Map([
    [Enchantment.Efficiency, [VanillaEnchantmentSlot.Tool]],
    [Enchantment.Unbreaking, [VanillaEnchantmentSlot.Tool]],
    [Enchantment.Fortune, [VanillaEnchantmentSlot.Tool]],
])

export { EnchantmentSlotMap }