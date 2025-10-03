import {
    BlockDestroyOptions,
    BlockIdentifier,
    BlockTrait,
    ItemIdentifier,
    Player,
} from "@serenityjs/core";

class BlockLeavesTrait extends BlockTrait {
    public static readonly identifier: string = "minecraft:leaves";
    public static readonly types: Array<BlockIdentifier> = [
        BlockIdentifier.OakLeaves
    ];

    public onBreak({ origin: player }: BlockDestroyOptions) {
        if (!player || !(player instanceof Player)) return;

        // 1 in 100 chance to drop an apple.
        if (Math.random() < 1 / 100) player.inventory.giveItem(ItemIdentifier.Apple, 1);

        // 1 in 15 chance to drop a sapling.
        if (Math.random() < 1 / 15) player.inventory.giveItem(ItemIdentifier.OakSapling, 1);

        // 1 in 50 chance to drop a stick.
        if (Math.random() < 1 / 50) player.inventory.giveItem(ItemIdentifier.Stick, 1);
    }
}

export { BlockLeavesTrait };