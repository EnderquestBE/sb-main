import {
    Block,
    BlockChestTrait,
    BlockDestroyOptions,
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

    public onUpdate() {
        // Check if the hopper is still connected to a chest.
        const chestTag = this.block.getStorageEntry<CompoundTag>("ConnectedChest");
        if (!chestTag) return;
        const x = chestTag.get<IntTag>("x")?.valueOf()!;
        const y = chestTag.get<IntTag>("y")?.valueOf()!;
        const z = chestTag.get<IntTag>("z")?.valueOf()!;
        const chestBlock = this.dimension.getBlock({ x, y, z });
        if (!chestBlock || !chestBlock.hasTrait(BlockChestTrait)) {
            this.block.deleteStorageEntry("ConnectedChest");
            this.block.sendStorageUpdate();

            // Alert the nearest player.
            const player = this.dimension.getPlayers().reduce((closest, player) => {
                const closestDistance = closest ? closest.position.distance(this.block.position) : Infinity;
                const playerDistance = player.position.distance(this.block.position);
                return playerDistance < closestDistance ? player : closest;
            }, null as Player | null);
            if (player && player.position.distance(this.block.position) < 7) {
                player.info("§cHopper is no longer connected to a chest.");
            }
        }
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

        // Set hopper direction.
        if (player.isSneaking && clickedFace) {
            let block = this.block.face(BlockHopperTrait.invertedBlockFace(clickedFace));
            // Hopper connecting to chest.
            if (block.identifier === BlockIdentifier.Chest) {
                // Get the parent for paired chests.
                const chestTrait = block.getTrait(BlockChestTrait);
                if (chestTrait && chestTrait.isPaired() && !chestTrait.getIsPairParent()) {
                    block = this.dimension.getBlock(chestTrait.getPaired()!);
                }

                // Check if the block is already connected to a hopper.
                if (block.hasStorageEntry("ConnectedHopper")) {
                    player.error("That chest is already connected to a hopper.");
                    return false;
                }

                // Set the hopper direction to face into the chest.
                this.block.setState("facing_direction", BlockHopperTrait.invertedBlockFace(clickedFace))

                // Store the location of the chest on the hopper.
                const chestTag = new CompoundTag();
                chestTag.set("x", new IntTag(block.position.x));
                chestTag.set("y", new IntTag(block.position.y));
                chestTag.set("z", new IntTag(block.position.z));

                // Store the location of the hopper on the chest.

                const hopperTag = new CompoundTag();
                hopperTag.set("x", new IntTag(this.block.position.x));
                hopperTag.set("y", new IntTag(this.block.position.y));
                hopperTag.set("z", new IntTag(this.block.position.z));

                this.block.setStorageEntry("ConnectedChest", chestTag);
                block.setStorageEntry("ConnectedHopper", hopperTag);

                // Alert the player.
                player.info("§aHopper has been connected to a chest.");

                // Increment island limit.
                if (island) island.incrementLimit("hoppers", 1)
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

    public onBreak({ origin: player }: BlockDestroyOptions): boolean | void {
        // Unlink from connected chest.
        const chestTag = this.block.getStorageEntry<CompoundTag>("ConnectedChest");
        if (chestTag) {
            const x = chestTag.get<IntTag>("x")?.valueOf()!;
            const y = chestTag.get<IntTag>("y")?.valueOf()!;
            const z = chestTag.get<IntTag>("z")?.valueOf()!;
            const chestBlock = this.dimension.getBlock({ x, y, z });

            if (chestBlock) {
                chestBlock.deleteStorageEntry("ConnectedHopper");
                chestBlock.sendStorageUpdate();

                // Get data for the island the crop is on.
                const island = Island.loadSync(this.islandName)

                // Decrement island limit.
                if (island) island.decrementLimit("hoppers", 1)

                // Alert the player.
                if (player?.isPlayer()) player.info("§cHopper removed.");
            }
        }
    }
}

export { BlockHopperTrait };