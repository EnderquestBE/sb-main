import { CustomEnchantment } from "../../Classes";

new CustomEnchantment("talaria", "Talaria")
    .setDescription("Grants a chance to double jump when activated.")
    .setRarity("Rare")
    .allowOnSlots("Boots")
    .setActivationChance({ base: 10, perLevel: 1, minimum: 1 })
    .register();