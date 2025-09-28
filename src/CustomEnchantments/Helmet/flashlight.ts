import { EffectType } from "@serenityjs/protocol";
import { CustomEnchantment } from "../../Classes";

new CustomEnchantment("flashlight", "Flashlight")
    .setDescription("Gives you night vision when activated.")
    .setRarity("Common")
    .allowOnSlots("Helmet")
    .setActivationChance({ base: 10, perLevel: 1, minimum: 1 })
    .whileItemEquipped(({ player }) => {
        if (player.hasEffect(EffectType.NightVision)) player.removeEffect(EffectType.NightVision);
        player.addEffect(EffectType.NightVision, 22, { amplifier: 0, showParticles: false });
    })
    .register();