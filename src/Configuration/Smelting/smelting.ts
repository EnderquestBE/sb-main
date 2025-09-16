import { ItemIdentifier } from "@serenityjs/core";

const ItemSmeltableMap: Map<ItemIdentifier, ItemIdentifier> = new Map([
    [ItemIdentifier.IronOre, ItemIdentifier.IronIngot],
    [ItemIdentifier.GoldOre, ItemIdentifier.GoldIngot],
])

export { ItemSmeltableMap }