import { BlockIdentifier } from "@serenityjs/core";
import { LiquidType } from "../../Types/types";
import { FlowingLiquidType } from "../../Types/Block/liquid";

// Map of all liquid-like blocks to their source part.
const LiquidBlockMap: {
  [key in LiquidType | FlowingLiquidType]: LiquidType;
} = {
  [BlockIdentifier.Water]: BlockIdentifier.Water,
  [BlockIdentifier.FlowingWater]: BlockIdentifier.Water,
  [BlockIdentifier.Lava]: BlockIdentifier.Lava,
  [BlockIdentifier.FlowingLava]: BlockIdentifier.Lava,
};

// Map of liquid source blocks to their liquid flowing part.
const FlowingBlockMap: {
  [key in LiquidType]: FlowingLiquidType;
} = {
  [BlockIdentifier.Water]: BlockIdentifier.FlowingWater,
  [BlockIdentifier.Lava]: BlockIdentifier.FlowingLava,
};

// Map of all flowing liquid blocks to their source part.
const SourceBlockMap: {
  [key in FlowingLiquidType]: LiquidType;
} = {
  [BlockIdentifier.FlowingWater]: BlockIdentifier.Water,
  [BlockIdentifier.FlowingLava]: BlockIdentifier.Lava,
};

// Time in ticks for one block of liquid to flow.
const FlowSpeed: {
  [key in LiquidType | FlowingLiquidType]: number;
} = {
  [BlockIdentifier.Water]: 15,
  [BlockIdentifier.FlowingWater]: 15,
  [BlockIdentifier.Lava]: 30,
  [BlockIdentifier.FlowingLava]: 30,
};

export { LiquidBlockMap, FlowingBlockMap, SourceBlockMap, FlowSpeed };
