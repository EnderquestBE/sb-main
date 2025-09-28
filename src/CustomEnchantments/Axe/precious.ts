import { CustomEnchantment } from "../../Classes";

new CustomEnchantment("precious", "Precious")
    .setDescription("Harvests crops as full blocks when activated.")
    .setRarity("Legendary")
    .allowOnSlots("Axe")
    .setActivationChance({ base: 11, perLevel: 1, minimum: 1 })
    .register();