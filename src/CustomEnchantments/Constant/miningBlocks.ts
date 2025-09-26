import { BlockIdentifier } from "@serenityjs/core";

const MiningBlocks = new Set([
    // Ores
    BlockIdentifier.Cobblestone,
    BlockIdentifier.Netherrack,
    BlockIdentifier.CoalOre,
    BlockIdentifier.IronOre,
    BlockIdentifier.GoldOre,
    BlockIdentifier.LapisOre,
    BlockIdentifier.EmeraldOre,
    BlockIdentifier.DiamondOre,
    // Crops
    BlockIdentifier.Pumpkin,
    BlockIdentifier.MelonBlock
])

export { MiningBlocks }