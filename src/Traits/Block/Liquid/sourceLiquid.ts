import {
  BlockIdentifier,
  BlockPermutation,
  BlockTrait,
  TraitOnTickDetails,
} from "@serenityjs/core";
import { Direction, LiquidType } from "../../../Types/types";
import { FlowingBlockMap, FlowSpeed, LiquidBlockMap } from "../../../Configuration/Block";
import { FlowingLiquidType } from "../../../Types/Block/liquid";
import { ServerTaskHandler } from "../../../Handlers";

const directions: Direction[] = ["north", "west", "east", "south"];

class SourceLiquidBlockTrait extends BlockTrait {
  public static readonly identifier = "minecraft:source_liquid";
  public static readonly types = Object.keys(LiquidBlockMap);

  public FLOW_SPEED: number = Infinity;

  public FLOWING_BLOCK_TYPE!: FlowingLiquidType;

  public onAdd(): void {
    this.FLOW_SPEED = FlowSpeed[this.block.identifier as LiquidType];
    this.FLOWING_BLOCK_TYPE = FlowingBlockMap[LiquidBlockMap[this.block.identifier as LiquidType | FlowingLiquidType]];
  }

  public onTick(details: TraitOnTickDetails): void {
    if (Number(details.currentTick) % this.FLOW_SPEED > 0) return;
    const depth = this.block.getState("liquid_depth");
    if (depth && depth !== 8) return;
    this.flowToSides(this.FLOWING_BLOCK_TYPE);
    //this.flowDownward(this.FLOWING_BLOCK_TYPE, this.FLOW_SPEED);
  }

  public flowToSides(flowingBlockType: BlockIdentifier) {
    for (const dir of directions) {
      const flowBlock = this.block[dir](1);
      if (flowBlock.identifier !== BlockIdentifier.Air) continue;
      flowBlock.setPermutation(
        BlockPermutation.resolve(flowingBlockType, {
          liquid_depth: 1,
        })
      );
    }
  }

  public flowDownward(flowingBlockType: BlockIdentifier, flowSpeed: number) {
    const fallBlock = this.block.below(1);
    if (fallBlock.identifier !== BlockIdentifier.Air) return;
    ServerTaskHandler.queueTask(() => {
      fallBlock.setPermutation(
        BlockPermutation.resolve(flowingBlockType, {
          liquid_depth: 8,
        })
      );
    }, flowSpeed);
  }
}

export { SourceLiquidBlockTrait };
