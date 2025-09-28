import { CustomEnchantment } from "../../Classes";

new CustomEnchantment("obsidian", "Obsidian")
    .setDescription("!! Grants immunity to fire damage when activated.")
    .setRarity("Rare")
    .allowOnSlots("Armor")
    .setActivationChance({ base: 10, perLevel: 1, minimum: 1 })
    .register();