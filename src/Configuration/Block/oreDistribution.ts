import { BlockIdentifier } from "@serenityjs/core";
import { WeightedItem } from "../../Types/types";

// If the default function is used for ChooseLavaWaterTransformation(), this distribution will be used.
// Add, remove, or change block identifiers to change which blocks generate.
// Higher weights indicate an item being chosen more often, the odds of an item being chosen are (weight / totalWeight).
const OreGeneratorDistribution: WeightedItem<BlockIdentifier>[] = [
  { value: BlockIdentifier.Cobblestone, weight: 50 },
  { value: BlockIdentifier.Netherrack, weight: 10 },
  { value: BlockIdentifier.CoalOre, weight: 25 },
  { value: BlockIdentifier.IronOre, weight: 10 },
  { value: BlockIdentifier.DiamondOre, weight: 5 },
];

export { OreGeneratorDistribution };
