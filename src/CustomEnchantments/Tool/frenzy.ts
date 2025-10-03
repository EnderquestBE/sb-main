import { EffectType } from "@serenityjs/protocol";
import { CustomEnchantment } from "../../Classes";
import { MiningBlocks } from "../Constant/miningBlocks";

new CustomEnchantment("frenzy", "Frenzy")
    .setDescription("Grants haste when activated.")
    .setRarity("Common")
    .allowOnSlots("Tool")
    .setActivationChance({ base: 26, perLevel: 2, minimum: 1 })
    .onBlockBreak(({ player, block, level }) => {
        if (!MiningBlocks.has(block.identifier)) return;
        if (player.hasEffect(EffectType.Haste)) player.removeEffect(EffectType.Haste);
        player.addEffect(EffectType.Haste, level, { amplifier: level > 6 ? 2 : 1, showParticles: false });
    })
    .register();