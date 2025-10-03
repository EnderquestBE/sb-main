import {
  BlockIdentifier,
  BlockPermutation,
  BlockTrait,
} from "@serenityjs/core";
import { Direction } from "../../../Types/types";
import { FlowSpeed, SourceBlockMap } from "../../../Configuration/Block/liquid";
import { FlowingLiquidType, LiquidType } from "../../../Types/Block/liquid";

class FlowingLiquidBlockTrait extends BlockTrait {
  public static readonly identifier = "minecraft:flowing_liquid";
  public static readonly types = Object.keys(
    SourceBlockMap
  ) as FlowingLiquidType[];

  public SOURCE_TYPE!: LiquidType;

  public FLOW_SPEED: number = Infinity;

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
    const directions: Direction[] = ["north", "west", "east", "south"];
    let isSource = false;
    for (const dir of directions) {
      const sourceBlock = this.block[dir](1);
      if (sourceBlock.identifier === this.SOURCE_TYPE) isSource = true;
    }
    if (!isSource)
      this.block.setPermutation(
        BlockPermutation.resolve(BlockIdentifier.Air)
      );
    //}
  }
}

export { FlowingLiquidBlockTrait };
