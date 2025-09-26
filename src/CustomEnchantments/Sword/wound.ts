import { CustomEnchantment } from "../../Classes";

new CustomEnchantment("wound", "Wound")
    .setDescription("!! Inflicts your opponent with temporary immunity to positive effects.")
    .setRarity("Exotic")
    .allowOnSlots("Sword")
    .setActivationChance({ base: 10, perLevel: 1, minimum: 1 })
    .register();