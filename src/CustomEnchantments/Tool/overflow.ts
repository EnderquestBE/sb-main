import { CustomEnchantment } from "../../Classes";
import { MiningBlocks } from "../Constant/miningBlocks";

new CustomEnchantment("overflow", "Overflow")
    .setDescription("Increases xp gained from breaking.")
    .setRarity("Exotic")
    .allowOnSlots("Tool")
    .setActivationChance({ base: 17, perLevel: 1, minimum: 1 })
    .onBlockBreak(({ player, block, level }) => {
        if (!MiningBlocks.has(block.identifier)) return;
        const xp = Math.floor(Math.random() * Math.ceil(level / 2) + 1);
        player.addXp(xp);
        if (player.getSetting("showXpOverlay")) player.onScreenDisplay.setActionBar(`§l§e>> §bOverflowed §d${xp} §6XP §e<<§r`)
    })
    .register();