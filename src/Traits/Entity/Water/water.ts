import {
  Block,
  BlockIdentifier,
  EntityTrait,
  TraitOnTickDetails,
} from "@serenityjs/core";
import { Vector3f } from "@serenityjs/protocol";
import { SpawnerEntity } from "../../../Handlers";

const WATER_PUSH_STRENGTH = 0.014 * 5;
const WATER_PULL_STRENGTH = -0.08 * 5;

const LIQUID_PUSH_BLOCKS = new Set<BlockIdentifier>([
  BlockIdentifier.FlowingWater,
  BlockIdentifier.Water,
]);

function getLiquidFlowVector(block: Block) {
  if (!LIQUID_PUSH_BLOCKS.has(block.identifier as BlockIdentifier))
    return new Vector3f(0, 0, 0);

  /*
    const blockAbove = block.above(1);
    return new Vector3f(0, WATER_PULL_STRENGTH, 0);
    */

  const getDepth = (b: Block): number => {
    const id = b.identifier;

    if (id === BlockIdentifier.Water) {
      return -1;
    }
    if (id === BlockIdentifier.FlowingWater) {
      return b.getState("liquid_depth") as number;
    }

    // Block is NOT a liquid.
    return 99;
  };

  // Get the depth of horizontal neighbors in directions.
  const currentDepth = getDepth(block);

  let eastDepth = getDepth(block.east(1));
  let westDepth = getDepth(block.west(1));
  let southDepth = getDepth(block.south(1));
  let northDepth = getDepth(block.north(1));

  if (eastDepth === 99) eastDepth = currentDepth;
  if (westDepth === 99) westDepth = currentDepth;
  if (southDepth === 99) southDepth = currentDepth;
  if (northDepth === 99) northDepth = currentDepth;

  const deltaX = eastDepth - westDepth;
  const deltaZ = southDepth - northDepth;

  const magnitude = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ);

  if (magnitude > 0) {
    return new Vector3f(
      (deltaX / magnitude) * WATER_PUSH_STRENGTH,
      0,
      (deltaZ / magnitude) * WATER_PUSH_STRENGTH
    );
  }

  return new Vector3f(0, 0, 0);
}

class EntityFloatableTrait extends EntityTrait {
  public static readonly identifier = "floatable";
  public static readonly types = SpawnerEntity.keys;

  public SPAWNER_INFO = SpawnerEntity.get(this.entity.identifier);

  public onTick({ currentTick }: TraitOnTickDetails) {
    if (currentTick % 5n !== 0n) return;
    if (this.SPAWNER_INFO) {
      let i = this.SPAWNER_INFO.height;
      while (i > 0) {
        const block = this.dimension.getBlock({
          x: this.entity.position.x,
          y: this.entity.position.y + i--,
          z: this.entity.position.z,
        });
        if (block.identifier === BlockIdentifier.FlowingWater) {
          this.entity.addMotion(getLiquidFlowVector(block));
        }
      }
    }
  }
}

export { EntityFloatableTrait };
