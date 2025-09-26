import { CustomEnchantment } from "../../Classes";

new CustomEnchantment("shaken", "Shaken")
    .setDescription("!! Grants immunity to immobilization when activated.")
    .setRarity("Legendary")
    .allowOnSlots("Armor")
    .setActivationChance({ base: 10, perLevel: 1, minimum: 1 })
    .register();