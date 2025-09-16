import {
  BlockIdentifier,
  BlockPermutation,
  BlockTrait,
  TraitOnTickDetails,
} from "@serenityjs/core";
import { Direction, LiquidType } from "../../../Types/types";
import { FlowingBlockMap, FlowSpeed, LiquidBlockMap } from "../../../Configuration/Block/liquid";
import { FlowingLiquidType } from "../../../Types/Block/liquid";

const directions: Direction[] = ["north", "west", "east", "south"];

class SourceLiquidBlockTrait extends BlockTrait {
  public static readonly identifier = "minecraft:source_liquid";
  public static readonly types = Object.keys(LiquidBlockMap);

  public onTick(details: TraitOnTickDetails): void {
    const flowSpeed = FlowSpeed[this.block.identifier as LiquidType];
    if (Number(details.currentTick) % flowSpeed > 0) return;
    const depth = this.block.getState("liquid_depth");
    if (depth && depth !== 8) return;
    const identifier =
      LiquidBlockMap[this.block.identifier as LiquidType | FlowingLiquidType];
    const flowingBlockType = FlowingBlockMap[identifier as LiquidType];
    this.flowToSides(flowingBlockType);
    this.flowDownward(flowingBlockType, flowSpeed);
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
    setTimeout(() => {
      fallBlock.setPermutation(
        BlockPermutation.resolve(flowingBlockType, {
          liquid_depth: 8,
        })
      );
    }, flowSpeed);
  }
}

export { SourceLiquidBlockTrait };
