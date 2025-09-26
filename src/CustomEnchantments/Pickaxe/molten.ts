import { CustomEnchantment } from "../../Classes";

new CustomEnchantment("molten", "Molten")
    .setDescription("Automatically smelts ores when activated.")
    .setRarity("Rare")
    .allowOnSlots("Pickaxe")
    .setActivationChance({ base: 11, perLevel: 1, minimum: 1 })
    .register();