import { EffectType } from "@serenityjs/protocol";
import { CustomEnchantment } from "../../Classes";

new CustomEnchantment("scurry", "Scurry")
    .setDescription("Grants speed when activated.")
    .setRarity("Legendary")
    .allowOnSlots("Leggings")
    .setActivationChance({ base: 10, perLevel: 1, minimum: 1 })
    .whileItemEquipped(({ player, level }) => {
        if (player.hasEffect(EffectType.Speed)) player.removeEffect(EffectType.Speed);
        player.addEffect(EffectType.Speed, Math.floor(level / 2), { amplifier: Math.floor(level / 4), showParticles: false });
    })
    .register();