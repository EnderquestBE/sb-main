import { CustomEnchantment } from "../../Classes";

new CustomEnchantment("aegis", "Aegis")
    .setDescription("!! Grants a chance to negate all damage when activated.")
    .setRarity("Legendary")
    .allowOnSlots("Armor")
    .setActivationChance({ base: 10, perLevel: 1, minimum: 1 })
    .register();