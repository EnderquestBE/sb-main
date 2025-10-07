import {
    ItemStack,
    ItemIdentifier,
    ItemStackTrait,
    BlockIdentifier,
    Player,
    ItemStackUseOnBlockOptions,
    BlockPermutation,
    ItemStackDurabilityTrait,
} from "@serenityjs/core";
import { BlockFace, ItemUseMethod } from "@serenityjs/protocol";

class ItemEquipmentActionTrait extends ItemStackTrait {
    public static readonly identifier = "equipment_action";

    public static readonly AXES = [
        ItemIdentifier.WoodenAxe,
        ItemIdentifier.StoneAxe,
        ItemIdentifier.GoldenAxe,
        ItemIdentifier.IronAxe,
        ItemIdentifier.DiamondAxe
    ];

    /*
    public static readonly SHOVELS = [
        ItemIdentifier.WoodenShovel,
        ItemIdentifier.StoneShovel,
        ItemIdentifier.GoldenShovel,
        ItemIdentifier.IronShovel,
        ItemIdentifier.DiamondShovel
    ]
        */

    public static readonly HOES = [
        ItemIdentifier.WoodenHoe,
        ItemIdentifier.StoneHoe,
        ItemIdentifier.GoldenHoe,
        ItemIdentifier.IronHoe,
        ItemIdentifier.DiamondHoe
    ]

    public static readonly types = [
        ...ItemEquipmentActionTrait.AXES,
        //...ItemEquipmentActionTrait.SHOVELS,
        ...ItemEquipmentActionTrait.HOES
    ];

    public type!: "axe" | /*"shovel" | */ "hoe";

    public constructor(item: ItemStack) {
        super(item);
        if (ItemEquipmentActionTrait.AXES.includes(item.identifier as ItemIdentifier)) this.type = "axe";
        //else if (ItemEquipmentActionTrait.SHOVELS.includes(item.identifier as ItemIdentifier)) this.type = "shovel";
        else if (ItemEquipmentActionTrait.HOES.includes(item.identifier as ItemIdentifier)) this.type = "hoe";
    }

    /**
     * Till soil.
     */
    public onUseOnBlock(player: Player, options: ItemStackUseOnBlockOptions): boolean {
        if (!this.type) return false;

        switch (this.type) {
            case "axe": return this.useAxe(player, options);
            //case "shovel": return this.useShovel(player, options);
            case "hoe": return this.useHoe(player, options);
        }
    }

    public static readonly strippedLogMap = new Map([
        [BlockIdentifier.OakLog, BlockIdentifier.StrippedOakLog],
        [BlockIdentifier.SpruceLog, BlockIdentifier.StrippedSpruceLog],
        [BlockIdentifier.BirchLog, BlockIdentifier.StrippedBirchLog],
        [BlockIdentifier.JungleLog, BlockIdentifier.StrippedJungleLog],
        [BlockIdentifier.AcaciaLog, BlockIdentifier.StrippedAcaciaLog],
        [BlockIdentifier.DarkOakLog, BlockIdentifier.StrippedDarkOakLog],
        [BlockIdentifier.CrimsonStem, BlockIdentifier.StrippedCrimsonStem],
        [BlockIdentifier.WarpedStem, BlockIdentifier.StrippedWarpedStem],
        [BlockIdentifier.MangroveLog, BlockIdentifier.StrippedMangroveLog],
        [BlockIdentifier.CherryLog, BlockIdentifier.StrippedCherryLog],
        [BlockIdentifier.BambooBlock, BlockIdentifier.StrippedBambooBlock]
    ]);

    private useAxe(player: Player, { targetBlock, method }: ItemStackUseOnBlockOptions): boolean {
        // Only allow interactions on logs.
        if (!ItemEquipmentActionTrait.strippedLogMap.has(targetBlock.identifier)) return false;

        // Set the use method to use tool.
        method = ItemUseMethod.UseTool

        // Set the block to stripped log.
        targetBlock.setPermutation(BlockPermutation.resolve(ItemEquipmentActionTrait.strippedLogMap.get(targetBlock.identifier)!))

        // Take durability.
        this.item.getTrait(ItemStackDurabilityTrait).processDamage(player);

        // Update the block.
        targetBlock.update()

        player.playSound("use.wood", { position: targetBlock.position })
        return false;
    }

    /*
    public static readonly pathable = new Set([
        BlockIdentifier.Dirt,
        BlockIdentifier.GrassBlock,
        BlockIdentifier.CoarseDirt
    ])

    private useShovel(player: Player, { targetBlock, method, face }: ItemStackUseOnBlockOptions): boolean {
        if (!ItemEquipmentActionTrait.pathable.has(targetBlock.identifier) || face !== BlockFace.Top) return false;

        // Check for an obstructing block above the soil block.
        if (targetBlock.above(1).identifier !== BlockIdentifier.Air) return false;

        // Set the use method to use tool.
        method = ItemUseMethod.UseTool

        // Set the block to dirt path.
        targetBlock.setPermutation(BlockPermutation.resolve(BlockIdentifier.GrassPath))

        // Take durability.
        this.item.getTrait(ItemStackDurabilityTrait).processDamage(player);

        // Update the block.
        targetBlock.update()

        player.playSound("use.grass", { position: targetBlock.position })
        return false;
    }
    */

    public static readonly tillable = new Set([
        BlockIdentifier.Dirt,
        BlockIdentifier.GrassBlock,
        BlockIdentifier.CoarseDirt
    ])

    private useHoe(player: Player, { targetBlock, method, face }: ItemStackUseOnBlockOptions): boolean {
        // Only allow interactions on the top of blocks.
        if (!ItemEquipmentActionTrait.tillable.has(targetBlock.identifier) || face !== BlockFace.Top) return false;

        // Check for an obstructing block above the soil block.
        if (targetBlock.above(1).identifier !== BlockIdentifier.Air) return false;

        // Set the use method to use tool.
        method = ItemUseMethod.UseTool

        // Set the block to farmland.
        targetBlock.setPermutation(BlockPermutation.resolve(BlockIdentifier.Farmland))

        // Take durability.
        this.item.getTrait(ItemStackDurabilityTrait).processDamage(player);

        // Update the block.
        targetBlock.update()

        player.playSound("use.grass", { position: targetBlock.position })
        return false;
    }
}

export { ItemEquipmentActionTrait };