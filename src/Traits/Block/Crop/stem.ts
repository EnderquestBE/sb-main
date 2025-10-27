import {
    Block,
    BlockIdentifier,
    BlockInteractionOptions,
    BlockPermutation,
    BlockTrait,
    EntityInventoryTrait,
    ItemIdentifier,
} from "@serenityjs/core";
import { Island } from "../../../Classes";
class BlockStemCropTrait extends BlockTrait {
    public static readonly identifier: string = "minecraft:stem";
    public static readonly types: Array<BlockIdentifier> = [
        BlockIdentifier.PumpkinStem,
        BlockIdentifier.MelonStem,
    ];

    private islandName: string;

    public MAX_GROWTH: number = 7;

    public PLUMP_BLOCK!: BlockPermutation;

    private neighbors = ["north", "south", "east", "west"]

    public constructor(block: Block) {
        super(block);
        this.islandName = this.dimension.world.identifier.slice(3)
        switch (block.identifier) {
            case BlockIdentifier.PumpkinStem:
                this.PLUMP_BLOCK = BlockPermutation.resolve(BlockIdentifier.Pumpkin);
                break;
            case BlockIdentifier.MelonStem:
                this.PLUMP_BLOCK = BlockPermutation.resolve(BlockIdentifier.MelonBlock);
                break;
        }
    }

    public onRandomTick(): void {
        // Get the growth of the stem.
        const growth = (this.block.getState("growth") as number)

        // Check if the stem is mature.
        if (growth < this.MAX_GROWTH) {
            this.grow(growth, 1)
        } else {
            // Choose a random neighbor to try to plump at.
            const neighborIndex = Math.floor(Math.random() * this.neighbors.length)

            // Try to plump a gourd.
            this.plump(neighborIndex)
        }
    }

    public onInteract({ origin }: BlockInteractionOptions): void {
        const player = origin

        // Check if there is a player interacting.
        if (!player) return;

        // Get the item the player is holding.
        const item = player.getHeldItem()

        // Check if the player is holding bonemeal.
        if (!item || item.identifier !== ItemIdentifier.BoneMeal) return;

        // Get the current growth state of the crop.
        const growth = (this.block.getState("growth") as number)

        // Check if the block has already reached max growth.
        if (growth >= this.MAX_GROWTH) return

        // Calculate the amount of growth for the crop.
        const fertilizerGrowth = Math.floor(Math.random() * (this.MAX_GROWTH - growth)) + 1;

        // Grow the crop.
        this.grow(growth, fertilizerGrowth)

        // Remove a piece of bonemeal from the player.
        if (item.stackSize > 1) item.decrementStack()
        else {
            const inv = player.getTrait(EntityInventoryTrait).container
            inv.clearSlot(inv.storage.indexOf(item))
        }

        // Play bone meal sound.
        player.playSound("item.bone_meal.use", { position: this.block.position })
    }

    public onBreak(): boolean | void {
        // Get data for the island the crop is on.
        const island = Island.loadSync(this.islandName)

        // Decrement island limit.
        if (island) island.decrementLimit("crops", 1)
    }

    public onUpdate(): void {
        // Check if there is still farmland below this crop.
        if (this.block.below(1).identifier !== BlockIdentifier.Farmland) {
            // Destroy the crop.
            this.block.destroy()
        }
    }

    protected plump(index: number): void {
        // If we have exhausted all neighbors, plump fail.
        if (index >= this.neighbors.length) return;

        // Get neighbor block.
        const neighborKey = this.neighbors[index] as "north" | "south" | "east" | "west"

        const neighbor = this.block[neighborKey]();

        // Check if the block can be plumped.
        if (neighbor.identifier !== BlockIdentifier.Air || !neighbor.below(1).isSolid) {
            return this.plump(index + 1)
        }

        // Set plump block.
        neighbor.setPermutation(this.PLUMP_BLOCK)

        // Update neighbor block.
        neighbor.update()
    }

    protected grow(growth: number, amount: number = 1): void {
        // Increase growth state.
        this.block.setState("growth", growth + amount)

        // Update block.
        this.block.update()
    }
}

export { BlockStemCropTrait };