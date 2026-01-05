import {
  BlockChestTrait,
  BlockIdentifier,
  Entity,
  EntityIdentifier,
  EntityItemStackTrait,
  EntityTrait,
  TraitOnTickDetails,
} from "@serenityjs/core";
import { ByteTag, CompoundTag, IntTag } from "@serenityjs/nbt";
import { Island } from "../../../Classes";
import { Vector3f } from "@serenityjs/protocol";

const DESTRUCTIVE_BLOCKS = new Set<string>([
  BlockIdentifier.Lava,
  BlockIdentifier.FlowingLava,
  BlockIdentifier.Fire,
  BlockIdentifier.Cactus,
]);

class EntityItemHandlerTrait extends EntityTrait {
  public static readonly identifier = "item_handler";
  public static readonly types = [EntityIdentifier.Item];

  public constructor(entity: Entity) {
    super(entity);
    // Set non-save.
    this.entity.setStorageEntry("Persistent", new ByteTag(0, "Persistent"));
  }

  public onTick({ currentTick }: TraitOnTickDetails): void {
    if (currentTick % 20n !== 0n) return;
    const block = this.dimension.getBlock(this.entity.position);
    if (DESTRUCTIVE_BLOCKS.has(block.identifier as BlockIdentifier)) {
      this.entity.despawn();
    } else if (
      block.identifier === BlockIdentifier.Hopper ||
      block.below(1).identifier === BlockIdentifier.Hopper
    ) {
      // Get the item data of the item entity.
      const item = this.entity.getTrait(EntityItemStackTrait).itemStack;

      // Remove the item entity.
      this.entity.despawn();

      // Check if the hopper is connected to a container.
      const hopperBlock =
        block.identifier === BlockIdentifier.Hopper ? block : block.below(1);
      const chestTag =
        hopperBlock.getStorageEntry<CompoundTag>("ConnectedChest");
      if (!chestTag) return;
      const x = chestTag.get<IntTag>("x")?.valueOf()!;
      const y = chestTag.get<IntTag>("y")?.valueOf()!;
      const z = chestTag.get<IntTag>("z")?.valueOf()!;
      const chestBlock = this.dimension.getBlock({ x, y, z });
      if (!chestBlock || !chestBlock.hasTrait(BlockChestTrait)) return;

      // Add the item to the container inventory.
      const chest = chestBlock.getTrait(BlockChestTrait).container;
      chest.addItem(item);
    } else if (
      this.entity.isFalling &&
      this.dimension.getBlock(
        this.entity.position.subtract({ x: 0, y: 1, z: 0 })
      ).isAir
    ) {
      const island = Island.loadSync(this.dimension.world.identifier.slice(3));
      if (island) {
        const spawn = island.getSpawn();
        if (spawn)
          this.entity.teleport(
            new Vector3f(spawn.x + 0.5, spawn.y + 1, spawn.z + 0.5),
            this.dimension
          );
      }
    }
  }

  public despawn() {
    this.entity.despawn();
  }
}

export { EntityItemHandlerTrait };
