import { ItemIdentifier } from "@serenityjs/core";

const CompressableMap = new Map([
    [ItemIdentifier.Coal, ItemIdentifier.CoalBlock],
    [ItemIdentifier.IronIngot, ItemIdentifier.IronBlock],
    [ItemIdentifier.GoldIngot, ItemIdentifier.GoldBlock],
    [ItemIdentifier.LapisLazuli, ItemIdentifier.LapisBlock],
    [ItemIdentifier.Diamond, ItemIdentifier.DiamondBlock],
    [ItemIdentifier.Emerald, ItemIdentifier.EmeraldBlock],
]);

export { CompressableMap };