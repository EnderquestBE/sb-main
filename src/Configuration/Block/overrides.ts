import { BlockIdentifier, ItemIdentifier } from "@serenityjs/core";

const BlockOverrides: Map<BlockIdentifier[], ItemIdentifier> = new Map([[
    [BlockIdentifier.StandingSign, BlockIdentifier.WallSign],
    ItemIdentifier.OakSign
],
[
    [BlockIdentifier.LitFurnace],
    ItemIdentifier.Furnace
]])

const BlockOverrideMap: Map<BlockIdentifier, ItemIdentifier> = new Map()

for (const [key, value] of BlockOverrides.entries()) {
    for (const k of key) {
        BlockOverrideMap.set(k as BlockIdentifier, value)
    }
}

export { BlockOverrideMap }