import { BlockIdentifier } from "@serenityjs/core";

type LiquidType = BlockIdentifier.Water | BlockIdentifier.Lava;
type FlowingLiquidType =
  | BlockIdentifier.FlowingWater
  | BlockIdentifier.FlowingLava;

export type { LiquidType, FlowingLiquidType };
