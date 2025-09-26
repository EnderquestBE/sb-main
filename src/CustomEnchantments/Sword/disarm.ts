import { CustomEnchantment } from "../../Classes";

new CustomEnchantment("disarm", "Disarm")
    .setDescription("!! Grants a chance to relocate your opponent's weapon into their inventory.")
    .setRarity("Legendary")
    .allowOnSlots("Sword")
    .setActivationChance({ base: 10, perLevel: 1, minimum: 1 })
    .register();