import {
  BlockIdentifier,
  BlockPermutation,
  BlockTrait,
  TraitOnTickDetails,
} from "@serenityjs/core";
import { Direction } from "../../Types/types";
import { FlowSpeed, SourceBlockMap } from "../../Configuration/Block/liquid";
import { FlowingLiquidType } from "../../Types/Block/liquid";

class FlowingLiquidBlockTrait extends BlockTrait {
  public static readonly identifier = "minecraft:flowing_liquid";
  public static readonly types = Object.keys(
    SourceBlockMap
  ) as FlowingLiquidType[];

  public onTick(details: TraitOnTickDetails): void {
    const sourceBlockType =
      SourceBlockMap[this.block.identifier as FlowingLiquidType];
    if (Number(details.currentTick) % FlowSpeed[sourceBlockType] > 0) return;
    const level = this.block.getState("liquid_depth");
    if (level === 8) {
      const sourceBlock = this.block.above(1);
      if (
        sourceBlock.identifier !== sourceBlockType &&
        sourceBlock.identifier !== this.block.identifier
      ) {
        this.block.setPermutation(
          BlockPermutation.resolve(BlockIdentifier.Air)
        );
      }
    } else {
      const directions: Direction[] = ["north", "west", "east", "south"];
      let isSource = false;
      for (const dir of directions) {
        const sourceBlock = this.block[dir](1);
        if (sourceBlock.identifier === sourceBlockType) isSource = true;
      }
      if (!isSource)
        this.block.setPermutation(
          BlockPermutation.resolve(BlockIdentifier.Air)
        );
    }
  }
}

export { FlowingLiquidBlockTrait };
