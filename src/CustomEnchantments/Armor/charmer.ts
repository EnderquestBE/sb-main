import { CustomEnchantment } from "../../Classes";

new CustomEnchantment("charmer", "Charmer")
    .setDescription("!! Grants immunity to negative effects when activated.")
    .setRarity("Rare")
    .allowOnSlots("Armor")
    .setActivationChance({ base: 10, perLevel: 1, minimum: 1 })
    .register();