import { CustomEnchantment } from "../../Classes";

new CustomEnchantment("prospect", "Prospect")
    .setDescription("Increases your chance of finding geodes from breaking.")
    .setRarity("Legendary")
    .allowOnSlots("Tool")
    .setActivationChance({ base: 1, perLevel: 1, minimum: 1 })
    .register();