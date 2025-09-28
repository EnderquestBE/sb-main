import { CustomEnchantment } from "../../Classes";

new CustomEnchantment("toxin", "Toxin")
    .setDescription("!! Inflicts target with poison when activated.")
    .setRarity("Common")
    .allowOnSlots("Sword")
    .setActivationChance({ base: 10, perLevel: 1, minimum: 1 })
    .register();