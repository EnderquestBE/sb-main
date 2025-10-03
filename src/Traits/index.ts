import * as CustomEntityTraits from "./Entity/traits";
import * as CustomItemTraits from "./Item/traits";
import * as CustomBlockTraits from "./Block/traits";
import { BlockTrait, EntityTrait, ItemStackTrait } from "@serenityjs/core";

/* Declare entity traits. */
const EntityTraits = Array<typeof EntityTrait>();

// Iterate over each trait
for (const key in CustomEntityTraits) {
    // Get the entity trait
    const trait = CustomEntityTraits[key as keyof typeof CustomEntityTraits];

    if (!(trait as typeof EntityTrait).identifier) continue;

    // Push the entity trait to the list
    EntityTraits.push(trait as typeof EntityTrait);
}

/* Declare item traits. */
const ItemTraits = Array<typeof ItemStackTrait>();

// Iterate over each trait
for (const key in CustomItemTraits) {
    // Get the item trait
    const trait = CustomItemTraits[key as keyof typeof CustomItemTraits];

    if (!(trait as typeof ItemStackTrait).identifier) continue;

    // Push the item trait to the list
    ItemTraits.push(trait as typeof ItemStackTrait);
}

/* Declare block traits. */
const BlockTraits = Array<typeof BlockTrait>();
// Iterate over each trait
for (const key in CustomBlockTraits) {
    // Get the block trait
    const trait = CustomBlockTraits[key as keyof typeof CustomBlockTraits];
    if (!(trait as typeof BlockTrait).identifier) continue;

    // Push the block trait to the list
    BlockTraits.push(trait as typeof BlockTrait);
}

export { EntityTraits, ItemTraits, BlockTraits };