import { CustomEnchantment } from "../../Classes";
import { MiningBlocks } from "../Constant/miningBlocks";
import { PlayerHungerTrait } from "@serenityjs/core";

new CustomEnchantment("siphon", "Siphon")
    .setDescription("Feeds you when activated.")
    .setRarity("Exotic")
    .allowOnSlots("Tool")
    .setActivationChance({ base: 13, perLevel: 1, minimum: 1 })
    .onBlockBreak(({ player, block }) => {
        if (!MiningBlocks.has(block.identifier)) return;
        const hunger = player.getTrait(PlayerHungerTrait)
        if (!hunger) return;
        hunger.currentValue = Math.min(hunger.currentValue + 1, hunger.maximumValue);
    })
    .register();