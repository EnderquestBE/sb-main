import { Block, BlockIdentifier } from "@serenityjs/core";
import { CustomEnchantment } from "../../Classes";
import { BlockHandler } from "../../Handlers";
import { OreBlocks } from "../Constant/oreBlocks";

new CustomEnchantment("crusher", "Crusher")
  .setDescription("Breaks a few extra connected ores when activated.")
  .setRarity("Rare")
  .allowOnSlots("Pickaxe")
  .setActivationChance({ base: 13, perLevel: 1, minimum: 1 })
  .onBlockBreak(({ player, block, item, level }) => {
    if (!OreBlocks.has(block.identifier as BlockIdentifier)) return;
    const above = block.above(1);
    if (OreBlocks.has(above.identifier as BlockIdentifier)) {
      const marked: Block[] = [];
      for (let i = 0; i < Math.ceil(level / 3); i++) {
        const above = block.above(i + 1);
        if (OreBlocks.has(above.identifier as BlockIdentifier)) {
          marked.push(above);
        }
      }
      BlockHandler.onBreak(player, item, ...marked);
      for (const b of marked) {
        b.destroy();
      }
    }
  })
  .register();
