import { EnchantmentSlotType } from "../../Configuration/config";
import { EnchantmentActivationChance, EnchantmentRarity, } from "../../Types/types";

interface CustomEnchantmentProperties {
    id: string;
    name: string;
    description: string;
    rarity: EnchantmentRarity;
    slots: EnchantmentSlotType[];
    activationChance: EnchantmentActivationChance;
    incompatible: string[];
}

export { CustomEnchantmentProperties }