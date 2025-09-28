import { CustomEnchantment } from "../../Classes";

new CustomEnchantment("vitality", "Vitality")
    .setDescription("!! Grants a chance to receive strength when damaged, stacking.")
    .setRarity("Exotic")
    .allowOnSlots("Chestplate")
    .setActivationChance({ base: 10, perLevel: 1, minimum: 1 })
    .register();