import {
    BlockIdentifier,
    BlockTrait
} from "@serenityjs/core";
class BlockNoInteractTrait extends BlockTrait {
    public static readonly identifier: string = "no_interact";
    public static readonly types: Array<BlockIdentifier> = [
        BlockIdentifier.Anvil,
        BlockIdentifier.ChippedAnvil,
        BlockIdentifier.DamagedAnvil,
        BlockIdentifier.BlastFurnace,
        BlockIdentifier.LitBlastFurnace,
        BlockIdentifier.BrewingStand,
        BlockIdentifier.CartographyTable,
        BlockIdentifier.Cauldron,
        BlockIdentifier.Composter,
        BlockIdentifier.Grindstone,
        BlockIdentifier.Dropper,
        BlockIdentifier.Grindstone,
        BlockIdentifier.Lectern,
        BlockIdentifier.Loom,
        BlockIdentifier.Noteblock,
        BlockIdentifier.SmithingTable,
        BlockIdentifier.Smoker,
        BlockIdentifier.StonecutterBlock,
        BlockIdentifier.Cake,
        BlockIdentifier.DragonEgg
    ];

    public onInteract(): boolean {
        return false;
    }
}

export { BlockNoInteractTrait };