import {
    Block,
    BlockIdentifier,
    BlockInteractionOptions,
    BlockPermutation,
    BlockTrait,
    EntityInventoryTrait,
    ItemIdentifier,
    Structure,
} from "@serenityjs/core";
import { readFileSync } from "node:fs";
import { BinaryStream } from "@serenityjs/binarystream";
import { CompoundTag, ShortTag } from "@serenityjs/nbt";
import { SpawnParticleEffectPacket, Vector3f } from "@serenityjs/protocol";
class BlockSaplingTrait extends BlockTrait {
    public static readonly identifier: string = "minecraft:sapling";
    public static readonly types: Array<BlockIdentifier> = [
        BlockIdentifier.OakSapling
    ];

    private static tree: Structure;

    public constructor(block: Block) {
        super(block);
        if (!BlockSaplingTrait.tree) {
            const buffer = readFileSync("./structures/tree/oak.mcstructure")
            const stream = new BinaryStream(buffer)
            const compound = CompoundTag.read(stream)
            BlockSaplingTrait.tree = Structure.from(this.dimension.world, compound)
        }
    }

    public onRandomTick(): void {
        // Increase crop growth.
        this.grow()
    }

    public onInteract({ origin }: BlockInteractionOptions): boolean {
        const player = origin

        // Check if there is a player interacting.
        if (!player) return false;

        // Get the item the player is holding.
        const item = player.getHeldItem()

        // Check if the player is holding bonemeal.
        if (!item || item.identifier !== ItemIdentifier.BoneMeal) return false;

        if (Math.random() < 1 / 6) this.grow();

        // Remove a piece of bonemeal from the player.
        if (item.getStackSize() > 1) item.decrementStack()
        else {
            const inv = player.getTrait(EntityInventoryTrait).container
            inv.clearSlot(inv.storage.indexOf(item))
        }

        // Play bone meal sound.
        player.playSound("item.bone_meal.use", { position: this.block.position })

        // Show bone meal particle.
        const packet = new SpawnParticleEffectPacket();
        packet.dimensionId = 0;
        packet.uniqueId = player.uniqueId;
        packet.position = new Vector3f(this.block.position.x, this.block.position.y, this.block.position.z);
        packet.effectName = "minecraft:crop_growth_emitter";

        player.send(packet)
        return false;
    }

    protected grow(): void {
        // Check if the sapling is obstructed.
        const blocks = [this.block.above(1), this.block.above(2), this.block.above(3), this.block.above(4)];

        if (blocks.some((x) => !x.isAir)) return;

        // Check the sapling's growth stage.
        const stage = this.block.getStorageEntry<ShortTag>("stage")?.valueOf() ?? 0;
        if (stage < 2) {
            this.block.setStorageEntry("stage", new ShortTag(stage + 1, "stage"));
            this.block.update();
            return;
        }

        // Grow the tree.
        this.block.setPermutation(BlockPermutation.resolve(BlockIdentifier.Air));
        this.block.update();
        this.dimension.placeStructure(BlockSaplingTrait.tree, this.block.position.subtract({ x: 2, y: 0, z: 2 }), { placeAirBlocks: false });
    }
}

export { BlockSaplingTrait };