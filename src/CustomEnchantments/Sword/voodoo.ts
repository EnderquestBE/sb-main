import { CustomEnchantment } from "../../Classes";

new CustomEnchantment("voodoo", "Voodoo")
    .setDescription("!! Inflicts target with hunger and weakness when activated.")
    .setRarity("Common")
    .allowOnSlots("Sword")
    .setActivationChance({ base: 10, perLevel: 1, minimum: 1 })
    .register();