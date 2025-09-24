import { CustomEnchantment } from "../../Classes";

new CustomEnchantment("wound", "Wound")
    .setDescription("Wounds target entity.")
    .setRarity("Common")
    .allowOnSlots("Sword")
    .setActivationChance({ base: 5, perLevel: 1, minimum: 1 })
    .onEntityHurt(({ player, target }) => {
        console.log(target.identifier + " has been wounded by " + player.username);
    })
    .register();