import { CustomEnchantment } from "../../Classes";
import { OreBlocks } from "../Constant/oreBlocks";
import { BlockIdentifier, ItemIdentifier } from "@serenityjs/core";

new CustomEnchantment("amulet", "Amulet")
  .setDescription(
    "Grants an additional chance of finding an emerald when mining."
  )
  .setRarity("Legendary")
  .allowOnSlots("Pickaxe")
  .setActivationChance({ base: 16, perLevel: 1, minimum: 1 })
  .onBlockBreak(({ player, block }) => {
    if (!OreBlocks.has(block.identifier as BlockIdentifier)) return;
    player.inventory.giveItem(ItemIdentifier.Emerald, 1);
  })
  .register();
