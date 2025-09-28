import { CustomEnchantment } from "../../Classes";

new CustomEnchantment("shroud", "Shroud")
    .setDescription("!! Inflicts target with blindness when activated.")
    .setRarity("Common")
    .allowOnSlots("Sword")
    .setActivationChance({ base: 10, perLevel: 1, minimum: 1 })
    .register();