import { Block } from "@serenityjs/core";
import { CustomEnchantment } from "../../Classes";
import { CropBlocks } from "../Constant/cropBlocks";
import { BlockHandler } from "../../Handlers/Block/handler";

new CustomEnchantment("vinepress", "Vinepress")
    .setDescription("Breaks a few extra crops directly connected to the crop when activated.")
    .setRarity("Legendary")
    .allowOnSlots("Axe")
    .setActivationChance({ base: 13, perLevel: 1, minimum: 1 })
    .onBlockBreak(({ player, block, item, level }) => {
        if (!CropBlocks.has(block.identifier)) return;
        const type = block.identifier;
        let i = 1;
        function selectDirection(block: Block) {
            if (i > Math.ceil(level / 2)) return null;
            const north = block.north(i);
            const east = block.east(i);
            if (block.identifier !== north.identifier) return "east"
            if (block.identifier !== east.identifier) return "north"
            i++;
            return selectDirection(block);
        }
        const direction = selectDirection(block);
        if (!direction) return;
        const marked: Block[] = [];
        const width = Math.ceil(level / 2);
        for (let j = 0 - Math.ceil(width / 2); j < width; j++) {
            const next = block[direction](j + 1);
            if (next.identifier !== type) break;
            marked.push(next);
        }
        BlockHandler.onBreak(player, item, ...marked);
        for (const b of marked) {
            b.destroy();
        }
    })
    .register();