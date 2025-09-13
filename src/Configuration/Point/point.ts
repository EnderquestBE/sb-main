import { BlockIdentifier, ItemIdentifier } from "@serenityjs/core";
import { BlockBreak } from "../../Types/types";

const BlockPointValues: { [key in BlockIdentifier]?: BlockBreak } = {
    /* Ores */
    [BlockIdentifier.CoalOre]: {
        break: { points: [0, 1], xp: [0, 2], item: ItemIdentifier.Coal, applyFortune: true }
    },
    [BlockIdentifier.IronOre]: {
        break: { points: [0, 2] }
    },
    [BlockIdentifier.GoldOre]: {
        break: { points: [0, 2] }
    },
    [BlockIdentifier.LapisOre]: {
        break: { points: [0, 3], xp: [2, 5], item: ItemIdentifier.LapisLazuli, amount: [1, 4], applyFortune: true }
    },
    [BlockIdentifier.DiamondOre]: {
        break: { points: [0, 3], xp: [2, 6], item: ItemIdentifier.Diamond, applyFortune: true }
    },
    [BlockIdentifier.EmeraldOre]: {
        break: { points: [0, 3], xp: [3, 7], item: ItemIdentifier.Emerald, applyFortune: true }
    },

    /* Ore Blocks */
    [BlockIdentifier.CoalBlock]: {
        place: { points: 10 },
        break: { points: -10 }
    },
    [BlockIdentifier.IronBlock]: {
        place: { points: 15 },
        break: { points: -15 }
    },
    [BlockIdentifier.GoldBlock]: {
        place: { points: 15 },
        break: { points: -15 }
    },
    [BlockIdentifier.LapisBlock]: {
        place: { points: 20 },
        break: { points: -20 }
    },
    [BlockIdentifier.DiamondBlock]: {
        place: { points: 25 },
        break: { points: -25 }
    },
    [BlockIdentifier.EmeraldBlock]: {
        place: { points: 25 },
        break: { points: -25 }
    },
    [BlockIdentifier.QuartzBlock]: {
        place: { points: 5 },
        break: { points: -5 }
    },
    [BlockIdentifier.Bedrock]: {
        place: { points: 18 },
        break: { points: 18 }
    }

}

export { BlockPointValues };