import { BlockIdentifier } from "@serenityjs/core";
import { WeightedItem } from "../../Types/types";

// If the default function is used for ChooseLavaWaterTransformation(), this distribution will be used.
// Add, remove, or change block identifiers to change which blocks generate.
// Higher weights indicate an item being chosen more often, the odds of an item being chosen are (weight / totalWeight).
const OreGeneratorDistribution: WeightedItem<BlockIdentifier>[] = [
  { value: BlockIdentifier.Cobblestone, weight: 28 },
  { value: BlockIdentifier.Netherrack, weight: 8 },
  { value: BlockIdentifier.CoalOre, weight: 20 },
  { value: BlockIdentifier.IronOre, weight: 17 },
  { value: BlockIdentifier.LapisOre, weight: 3 },
  { value: BlockIdentifier.GoldOre, weight: 14 },
  { value: BlockIdentifier.DiamondOre, weight: 5 },
  { value: BlockIdentifier.EmeraldOre, weight: 5 },
];

export { OreGeneratorDistribution };
