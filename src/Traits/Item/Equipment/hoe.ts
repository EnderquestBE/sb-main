import {
    ItemStack,
    ItemIdentifier,
    ItemStackTrait,
    BlockIdentifier,
    Player,
    ItemStackUseOnBlockOptions,
    BlockPermutation,
} from "@serenityjs/core";
import { BlockFace, ItemUseMethod } from "@serenityjs/protocol";

const MessageCooldown = new Map<string, number>()

class ItemHoeTrait extends ItemStackTrait {
    public static readonly identifier = "minecraft:hoe";

    public static readonly types = [
        ItemIdentifier.WoodenHoe,
        ItemIdentifier.StoneHoe,
        ItemIdentifier.GoldenHoe,
        ItemIdentifier.IronHoe,
        ItemIdentifier.DiamondHoe
    ];

    public static readonly tillable = new Set([
        BlockIdentifier.Dirt,
        BlockIdentifier.GrassBlock,
        BlockIdentifier.CoarseDirt
    ])

    public constructor(item: ItemStack) {
        super(item);
    }

    /**
     * Till soil.
     */
    public onUseOnBlock(player: Player, { targetBlock, method, face }: ItemStackUseOnBlockOptions): void {
        // Only allow placements on the top of farmland.
        if (!ItemHoeTrait.tillable.has(targetBlock.identifier) || face !== BlockFace.Top) return

        // Check for an obstructing block above the soil block.
        if (targetBlock.above(1).identifier !== BlockIdentifier.Air) return

        // Set the use method to use tool.
        method = ItemUseMethod.UseTool

        // Set the block to farmland.
        targetBlock.setPermutation(BlockPermutation.resolve(BlockIdentifier.Farmland))

        // Update the block.
        targetBlock.update()

        player.playSound("use.gravel", { position: targetBlock.position })
    }
}

export { ItemHoeTrait };