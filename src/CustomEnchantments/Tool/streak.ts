import { EffectType } from "@serenityjs/protocol";
import { CustomEnchantment } from "../../Classes";
import { MiningBlocks } from "../Constant/miningBlocks";
import { BlockIdentifier } from "@serenityjs/core";

new CustomEnchantment("streak", "Streak")
  .setDescription("Grants speed when activated.")
  .setRarity("Common")
  .allowOnSlots("Tool")
  .setActivationChance({ base: 13, perLevel: 1, minimum: 1 })
  .onBlockBreak(({ player, block, level }) => {
    if (!MiningBlocks.has(block.identifier as BlockIdentifier)) return;
    if (player.hasEffect(EffectType.Speed))
      player.removeEffect(EffectType.Speed);
    player.addEffect(EffectType.Speed, level * 2, {
      amplifier: Math.ceil(level / 4) - 1,
      showParticles: false,
    });
  })
  .register();
