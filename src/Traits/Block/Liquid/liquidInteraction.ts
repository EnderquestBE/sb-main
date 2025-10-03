import {
  BlockIdentifier,
  BlockPermutation,
  BlockTrait,
  TraitOnTickDetails,
} from "@serenityjs/core";
import { WeightedSelector } from "../../../Utils/weightedSelection";
import { Direction } from "../../../Types/types";
import { SourceBlockMap } from "../../../Configuration/Block/liquid";
import { FlowingLiquidType } from "../../../Types/Block/liquid";
import { OreGeneratorDistribution } from "../../../Configuration/Block/oreDistribution";

const OreSelector = new WeightedSelector<BlockIdentifier>(
  OreGeneratorDistribution
);

const directions: Direction[] = ["north", "west", "east", "south"];
const neighbors: Direction[] = ["north", "west", "east", "south", "below"];

class LiquidInteractionBlockTrait extends BlockTrait {
  public static readonly identifier = "minecraft:liquid_interaction";
  public static readonly types = [
    BlockIdentifier.Water,
    BlockIdentifier.FlowingWater,
    BlockIdentifier.Lava,
    BlockIdentifier.FlowingLava,
  ];

  public onTick(details: TraitOnTickDetails): void {
    if (Number(details.currentTick) % 25 > 0) return;
    switch (this.block.identifier) {
      case BlockIdentifier.Water:
        this.InteractWithConnectedLavaSource();
        break;
      case BlockIdentifier.FlowingWater:
        this.InteractWithConnectedLavaSource();
        break;
      case BlockIdentifier.Lava:
        this.InteractWithFlowingWaterSides();
        this.InteractWithWaterBelow();
        break;
      case BlockIdentifier.FlowingLava:
        this.InteractWithWaterBelow();
        break;
    }
  }

  /**
   * This method represents the vanilla mechanic of converting lava next to water into obsidian.
   * @types Water, Flowing Water
   */
  public InteractWithConnectedLavaSource() {
    for (const neighbor of neighbors) {
      const checkLava = this.block[neighbor](1);
      if (checkLava.identifier === BlockIdentifier.Lava) {
        checkLava.setPermutation(
          BlockPermutation.resolve(BlockIdentifier.Obsidian)
        );
      }
    }
  }

  /**
   * This method represents the vanilla mechanic of flowing water and lava interaction creating cobblestone.
   * @types Lava
   */
  public InteractWithFlowingWaterSides() {
    for (const dir of directions) {
      const checkWater = this.block[dir](2);
      if (
        checkWater.identifier !== BlockIdentifier.FlowingWater ||
        checkWater.getState("liquid_depth") !== 1
      )
        continue;
      const transformBlock = this.block[dir](1);
      if (
        transformBlock.identifier === BlockIdentifier.Air ||
        SourceBlockMap[transformBlock.identifier as FlowingLiquidType]
      ) {
        const tranformation = this.ChooseLavaWaterTransformation();
        if (!tranformation) continue;
        transformBlock.setPermutation(BlockPermutation.resolve(tranformation));
      }
    }
  }

  /**
   * Method to choose the replacement block of the above method.
   */
  public ChooseLavaWaterTransformation() {
    //return BlockIdentifier.Cobblestone;
    return OreSelector.select();
  }

  /**
   * This method represents the vanilla mechanic of converting water below lava into stone.
   * @types Lava, Flowing Lava
   */
  public InteractWithWaterBelow() {
    const checkWater = this.block.below(1);
    if (
      checkWater.identifier === BlockIdentifier.Water ||
      checkWater.identifier === BlockIdentifier.FlowingWater
    ) {
      checkWater.setPermutation(
        BlockPermutation.resolve(BlockIdentifier.Stone)
      );
    }
  }
}

export { LiquidInteractionBlockTrait };
