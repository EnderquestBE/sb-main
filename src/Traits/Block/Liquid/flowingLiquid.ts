import {
  BlockIdentifier,
  BlockPermutation,
  BlockTrait,
  TraitOnTickDetails,
} from "@serenityjs/core";
import { Direction } from "../../../Types/types";
import { FlowSpeed, SourceBlockMap } from "../../../Configuration/Block";
import { FlowingLiquidType, LiquidType } from "../../../Types/Block/liquid";
import { ServerTaskHandler } from "../../../Handlers";

const directions: Direction[] = ["north", "west", "east", "south"];

const MAX_LIQUID_DEPTH = 8;

class FlowingLiquidBlockTrait extends BlockTrait {
  public static readonly identifier = "minecraft:flowing_liquid";
  public static readonly types = Object.keys(
    SourceBlockMap
  ) as FlowingLiquidType[];

  public SOURCE_TYPE!: LiquidType;

  public FLOW_SPEED: number = Infinity;

  public isFirstTick: boolean = true;

  public isSustained: boolean = false;

  public onAdd(): void {
    this.SOURCE_TYPE =
      SourceBlockMap[this.block.identifier as FlowingLiquidType];
    this.FLOW_SPEED = FlowSpeed[this.SOURCE_TYPE];
  }

  public onUpdate(): void {
    //const level = this.block.getState("liquid_depth");
    /*
    if (level === 8) {
      const sourceBlock = this.block.above(1);
      if (
        sourceBlock.identifier !== this.SOURCE_TYPE &&
        sourceBlock.identifier !== this.block.identifier
      ) {
        this.block.setPermutation(
          BlockPermutation.resolve(BlockIdentifier.Air)
        );
      }
    } else {
      */
    const currentDepth = this.block.getState("liquid_depth") as number;

    this.isSustained = false;

    for (const dir of directions) {
      const adjacentBlock = this.block[dir](1);
      if (adjacentBlock.identifier === this.SOURCE_TYPE) {
        this.isSustained = true;
        break;
      }
      if (adjacentBlock.identifier === this.block.identifier) {
        const adjacentDepth = adjacentBlock.getState("liquid_depth") as number;
        if (adjacentDepth < currentDepth) {
          this.isSustained = true;
          break;
        }
      }
    }

    if (!this.isSustained) {
      ServerTaskHandler.queueTask(() =>
        this.block.setPermutation(BlockPermutation.resolve(BlockIdentifier.Air))
        , this.FLOW_SPEED * 20);
    }
  }

  public onTick(details: TraitOnTickDetails): void {
    if (this.isFirstTick) {
      this.isFirstTick = false;
      return;
    }
    if (!this.isSustained) return;
    if (Number(details.currentTick) % this.FLOW_SPEED > 0) return;
    const depth = this.block.getState("liquid_depth") as number + 1;
    if (depth < MAX_LIQUID_DEPTH) this.flowToSides(depth);
    //this.flowDownward(this.FLOWING_BLOCK_TYPE, this.FLOW_SPEED);
  }

  public flowToSides(depth: number) {
    const flowingBlockType = this.block.identifier;
    for (const dir of directions) {
      const flowBlock = this.block[dir](1);
      if (flowBlock.identifier !== BlockIdentifier.Air && flowBlock.identifier !== flowingBlockType) continue;
      if (flowBlock.identifier === flowingBlockType) {
        const existingDepth = flowBlock.getState("liquid_depth") as number;
        if (existingDepth <= depth) continue;
        flowBlock.setState("liquid_depth", depth);
      } else {
        flowBlock.setPermutation(
          BlockPermutation.resolve(flowingBlockType, {
            liquid_depth: depth,
          })
        );
      }
    }
  }
}

export { FlowingLiquidBlockTrait };
