import { CustomEnchantment } from "../../Classes";

new CustomEnchantment("scholar", "Scholar")
    .setDescription("Increases xp gained from slaying mobs.")
    .setRarity("Exotic")
    .allowOnSlots("Sword")
    .setActivationChance({ base: 10, perLevel: 1, minimum: 1 })
    .register();