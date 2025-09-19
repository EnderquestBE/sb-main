import { BlockIdentifier } from "@serenityjs/core";

const CropLevelRequirement: { [key in BlockIdentifier]?: number } = {
    [BlockIdentifier.Beetroot]: 2,
    [BlockIdentifier.Wheat]: 5,
    [BlockIdentifier.Carrots]: 15,
    [BlockIdentifier.Potatoes]: 30,
    [BlockIdentifier.Cactus]: 50,
    [BlockIdentifier.PumpkinStem]: 70,
    [BlockIdentifier.MelonStem]: 100
}

export { CropLevelRequirement }