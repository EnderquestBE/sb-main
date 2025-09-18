import {
    Block,
    BlockIdentifier,
    BlockPlacementOptions,
    BlockTrait,
} from "@serenityjs/core";
import { Island } from "../../../Classes/classes";
import { CropLevelRequirement } from "../../../Configuration/config";
class BlockMultiBlockCropTrait extends BlockTrait {
    public static readonly identifier: string = "minecraft:multiblock_crop";
    public static readonly types: Array<BlockIdentifier> = [
        BlockIdentifier.Cactus
    ];

    private islandName: string;

    public MAX_HEIGHT: number = 3;

    public ALLOW_OBSTRUCTION: boolean = false;

    public SOIL: Set<BlockIdentifier> = new Set()

    private neighbors = ["north", "south", "east", "west"]

    public constructor(block: Block) {
        super(block);
        this.islandName = this.dimension.world.identifier.slice(3)
        switch (block.identifier) {
            case BlockIdentifier.Cactus:
                this.ALLOW_OBSTRUCTION = true;
                this.SOIL = new Set([BlockIdentifier.Sand])
                break;
        }
    }

    public onRandomTick(): void {
        // Increase crop growth.
        this.grow()
    }

    public onPlace({ origin }: BlockPlacementOptions): boolean {
        // Check if a player is responsible for placement.
        if (!origin || !origin.isPlayer()) return false

        // Get data for the island the crop is on.
        const island = Island.loadSync(this.islandName)
        if (!island) return false

        // Check if the crop has been unlocked for the island.
        if (island.getLevel() < CropLevelRequirement[this.block.identifier]!) {
            origin.error(`Island has not unlocked this crop yet.\n§6Use §e/is crops §6to see when it unlocks.`)
            return false
        }

        // Check if the limit has been reached.
        if (island.isLimitReached("crops")) {
            const limit = island.getLimit("crops")
            origin.error(`Island has reached the crop limit §8(§4${limit.max}§8)§c.\n§dUse §e/is expand §dto increase it.`)
            return false
        }

        // Increment island limit.
        if (island) island.incrementLimit("crops", 1)

        // Allow placement.
        return true
    }

    public onBreak(): boolean | void {
        // Get data for the island the crop is on.
        const island = Island.loadSync(this.islandName)

        // Decrement island limit.
        if (island) island.decrementLimit("crops", 1)
    }

    public onUpdate(): void {
        // Check if the plant still has blocks below it.
        const below = this.block.below(1)

        if (below.identifier !== this.block.identifier && !this.SOIL.has(below.identifier)) {
            this.pop();
        }

        // Check if the block can be obstructed by neighboring blocks, like cactuses.
        if (!this.ALLOW_OBSTRUCTION) return

        for (const neighbor of this.neighbors) {
            // Check if there are blocks obstructing the crop.
            if (this.block[neighbor as "north" | "south" | "east" | "west"]().identifier !== BlockIdentifier.Air) {
                // "Pop" the crop.
                this.pop()
                break;
            }
        }
    }

    protected grow(): void {
        // Check if there is a block above the multiblock crop.
        if (this.block.above(1).identifier !== BlockIdentifier.Air) return;

        // Check for obstructions before placing the block to save on logic.
        if (this.ALLOW_OBSTRUCTION) {
            for (const neighbor of this.neighbors) {
                // Check if there are blocks obstructing the crop.
                if (this.block[neighbor as "north" | "south" | "east" | "west"]().identifier !== BlockIdentifier.Air) {
                    // "Pop" the crop before it is even placed.
                    const item = this.block.getItemStack()

                    this.dimension.spawnItem(item, this.block.position.add({ x: -0.5, y: 0, z: 0.5 }));
                    return
                }
            }
        }

        // Get data for the island the crop is on.
        const island = Island.loadSync(this.islandName)

        if (island?.isLimitReached("crops")) return;

        // Get current height of plant.
        let height = 1;
        for (let i = 1; i < this.MAX_HEIGHT; i++) {
            const block = this.block.below(i)
            if (block.identifier === this.block.identifier) height++;
            else break;
        }

        if (height >= this.MAX_HEIGHT) return;

        // Grow crop.
        const growthBlock = this.block.above(1)

        growthBlock.setPermutation(this.block.permutation)

        // Update block.
        growthBlock.update()

        // Increment island limit.
        if (island) island.incrementLimit("crops", 1)
    }

    public pop() {
        // Get the block as an item.
        const item = this.block.getItemStack()

        // "Pop" the crop.
        this.block.destroy()

        // Drop an item.
        this.dimension.spawnItem(item, this.block.position.add({ x: -0.5, y: 0, z: 0.5 }));
    }
}

export { BlockMultiBlockCropTrait };