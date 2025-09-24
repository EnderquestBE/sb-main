import { EffectType } from "@serenityjs/protocol";
import { CustomEnchantment } from "../../Classes";

new CustomEnchantment("quickening", "Quickening")
    .setDescription("Gives you haste when activated.")
    .setRarity("Common")
    .allowOnSlots("Pickaxe")
    .setActivationChance({ base: 5, perLevel: 1, minimum: 1 })
    .onBlockBreak(({ player }) => {
        console.log("added haste")
        //@ts-ignore
        console.log("before", player.miningSpeed)
        player.addEffect(EffectType.Haste, 10, { amplifier: 5, showParticles: true });
        //@ts-ignore
        console.log("after", player.miningSpeed)
    })
    .register();