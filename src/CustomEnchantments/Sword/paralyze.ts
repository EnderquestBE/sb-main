import { CustomEnchantment } from "../../Classes";

new CustomEnchantment("paralyze", "Paralyze")
    .setDescription("!! Immobilizes target when activated.")
    .setRarity("Rare")
    .allowOnSlots("Sword")
    .setActivationChance({ base: 10, perLevel: 1, minimum: 1 })
    .register();