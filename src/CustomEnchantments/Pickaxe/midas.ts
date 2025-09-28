import { CustomEnchantment } from "../../Classes";

new CustomEnchantment("midas", "Midas")
    .setDescription("Grants a chance for cobblestone to drop gold instead when activated.")
    .setRarity("Exotic")
    .allowOnSlots("Pickaxe")
    .setActivationChance({ base: 20, perLevel: 2, minimum: 1 })
    .register();