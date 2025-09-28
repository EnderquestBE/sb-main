import { CustomEnchantment } from "../../Classes";

new CustomEnchantment("sealed", "Sealed")
    .setDescription("!! Grants immunity to disarmament when activated.")
    .setRarity("Exotic")
    .allowOnSlots("Armor")
    .setActivationChance({ base: 10, perLevel: 1, minimum: 1 })
    .register();