import { Enchantment } from "@serenityjs/protocol";

const EnchantmentIncompatibleMap: Map<Enchantment, Enchantment[]> = new Map([
    [Enchantment.BaneOfArthropods, [Enchantment.Smite, Enchantment.Sharpness]],
    [Enchantment.Smite, [Enchantment.BaneOfArthropods, Enchantment.Sharpness]],
    [Enchantment.Sharpness, [Enchantment.BaneOfArthropods, Enchantment.Smite]],
])

export { EnchantmentIncompatibleMap }