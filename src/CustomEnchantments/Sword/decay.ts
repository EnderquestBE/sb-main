import { CustomEnchantment } from "../../Classes";

new CustomEnchantment("decay", "Decay")
    .setDescription("!! Inflicts target with withering when activated.")
    .setRarity("Common")
    .allowOnSlots("Sword")
    .setActivationChance({ base: 10, perLevel: 1, minimum: 1 })
    .register();