import { CustomEnchantment } from "../../Classes";

new CustomEnchantment("striker", "Striker")
    .setDescription("!! Grants a chance to attack twice when activated.")
    .setRarity("Legendary")
    .allowOnSlots("Sword")
    .setActivationChance({ base: 10, perLevel: 1, minimum: 1 })
    .register();