import {
    Block,
    BlockIdentifier,
    BlockPlacementOptions,
    BlockTrait,
    Player,
} from "@serenityjs/core";
import { Island } from "../../../Classes";
import { BlockFace } from "@serenityjs/protocol";
import { CompoundTag, IntTag } from "@serenityjs/nbt";
class BlockHopperTrait extends BlockTrait {
    public static readonly identifier: string = "hopper";
    public static readonly types: Array<BlockIdentifier> = [
        BlockIdentifier.Hopper
    ];

    public static invertedBlockFace(face: BlockFace): BlockFace {
        switch (face) {
            case BlockFace.North: return BlockFace.South;
            case BlockFace.South: return BlockFace.North;
            case BlockFace.East: return BlockFace.West;
            case BlockFace.West: return BlockFace.East;
            default: return BlockFace.North;
        }
    }

    private islandName: string;

    public constructor(block: Block) {
        super(block);
        this.islandName = this.dimension.world.identifier.slice(3)
    }

    public onPlace({ origin: player, clickedFace }: BlockPlacementOptions): boolean {
        // Check if a player is responsible for placement.
        if (!(player instanceof Player)) return false;

        // Get data for the island the crop is on.
        const island = Island.loadSync(this.islandName)
        if (!island) return false;

        // Check if the limit has been reached.
        if (island.isLimitReached("hoppers")) {
            const limit = island.getLimit("hoppers")
            player.error(`Island has reached the hopper limit §8(§4${limit.max}§8)§c.\n§dUse §e/is expand §dto increase it.`)
            return false;
        }

        // Increment island limit.
        if (island) island.incrementLimit("hoppers", 1)

        // Set hopper direction.
        if (player.isSneaking && clickedFace) {
            const block = this.block.face(BlockHopperTrait.invertedBlockFace(clickedFace));
            if (block.identifier === BlockIdentifier.Chest) {
                this.block.setState("facing_direction", BlockHopperTrait.invertedBlockFace(clickedFace))
                const chestTag = new CompoundTag();
                chestTag.set("x", new IntTag(block.position.x));
                chestTag.set("y", new IntTag(block.position.y));
                chestTag.set("z", new IntTag(block.position.z));
                this.block.setStorageEntry("ConnectedChest", chestTag);
            } else {
                this.block.setState("facing_direction", 0)
                this.block.setState("toggle_bit", false)
            }
        } else {
            this.block.setState("facing_direction", 0)
            this.block.setState("toggle_bit", false)
        }
        this.block.update();
        // Allow placement.
        return true
    }

    public onInteract(): boolean {
        return false;
    }

    public onBreak(): boolean | void {
        // Get data for the island the crop is on.
        const island = Island.loadSync(this.islandName)

        // Decrement island limit.
        if (island) island.decrementLimit("hoppers", 1)
    }
}

export { BlockHopperTrait };