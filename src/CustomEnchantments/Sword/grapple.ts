import { CustomEnchantment } from "../../Classes";

new CustomEnchantment("grapple", "Grapple")
    .setDescription("!! Pulls opponent towards you when activated.")
    .setRarity("Rare")
    .allowOnSlots("Sword")
    .setActivationChance({ base: 10, perLevel: 1, minimum: 1 })
    .register();