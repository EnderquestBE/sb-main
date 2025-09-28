import { Block } from "@serenityjs/core";
import { CustomEnchantment } from "../../Classes";
import { LogBlocks } from "../Constant/logBlocks";

new CustomEnchantment("splitter", "Splitter")
    .setDescription("Chops down an entire tree when activated.")
    .setRarity("Rare")
    .allowOnSlots("Axe")
    .setActivationChance({ base: 11, perLevel: 1, minimum: 1 })
    .onBlockBreak(({ player, block }) => {
        if (!LogBlocks.has(block.identifier) || player.isSneaking) return;
        let i = 0;
        function checkBlock(block: Block) {
            if (!LogBlocks.has(block.identifier)) return;
            block.destroy();
            i++;
            checkBlock(block.above(1));
            return true;
        }
        checkBlock(block.above(1));
        player.inventory.giveItem(block.identifier, i);
    })
    .register();