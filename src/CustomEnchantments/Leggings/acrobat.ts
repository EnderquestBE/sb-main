import { EffectType } from "@serenityjs/protocol";
import { CustomEnchantment } from "../../Classes";

new CustomEnchantment("acrobat", "Acrobat")
    .setDescription("Grants jump boost when activated.")
    .setRarity("Common")
    .allowOnSlots("Leggings")
    .setActivationChance({ base: 10, perLevel: 1, minimum: 1 })
    .whileItemEquipped(({ player, level }) => {
        if (player.hasEffect(EffectType.JumpBoost)) player.removeEffect(EffectType.JumpBoost);
        player.addEffect(EffectType.JumpBoost, Math.floor(level / 2), { amplifier: Math.floor(level / 4), showParticles: false });
    })
    .register();