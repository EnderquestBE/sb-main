import {
    ItemStack,
    ItemIdentifier,
    ItemStackTrait,
    BlockIdentifier,
    Player,
    ItemStackUseOnBlockOptions,
    BlockType,
    BlockPermutation,
    EntityInventoryTrait,
} from "@serenityjs/core";
import { BlockFace, ItemUseMethod } from "@serenityjs/protocol";
import { Island } from "../../../Classes/classes";
import { CropLevelRequirement } from "../../../Configuration/config";

const MessageCooldown = new Map<string, number>()

class ItemSeedTrait extends ItemStackTrait {
    public static readonly identifier = "minecraft:seeds";

    public static readonly types = [
        ItemIdentifier.BeetrootSeeds,
        ItemIdentifier.WheatSeeds,
        ItemIdentifier.Carrot,
        ItemIdentifier.Potato,
        ItemIdentifier.PumpkinSeeds,
        ItemIdentifier.MelonSeeds
    ];

    /**
     * The crop block to place when this item is used.
     */
    public CROP_BLOCK!: BlockIdentifier;

    public constructor(item: ItemStack) {
        super(item);

        this.assignDefault();
    }

    /**
     * Assigns the default values to the component.
     */
    protected assignDefault(): void {
        // Get the item identifier.
        const identifier = this.item.type.identifier;

        // Switch based on the identifier.
        switch (identifier) {
            case ItemIdentifier.BeetrootSeeds:
                this.CROP_BLOCK = BlockIdentifier.Beetroot
                break;
            case ItemIdentifier.WheatSeeds:
                this.CROP_BLOCK = BlockIdentifier.Wheat
                break;
            case ItemIdentifier.Carrot:
                this.CROP_BLOCK = BlockIdentifier.Carrots
                break;
            case ItemIdentifier.Potato:
                this.CROP_BLOCK = BlockIdentifier.Potatoes
                break;
            case ItemIdentifier.PumpkinSeeds:
                this.CROP_BLOCK = BlockIdentifier.PumpkinStem
                break;
            case ItemIdentifier.MelonSeeds:
                this.CROP_BLOCK = BlockIdentifier.MelonStem
                break;
        }
    }

    /**
     * Places the crop item.
     */
    public onUseOnBlock(player: Player, { targetBlock, method, placingBlock, face }: ItemStackUseOnBlockOptions): void {
        // Only allow placements on the top of farmland.
        if (targetBlock.identifier !== BlockIdentifier.Farmland || face !== BlockFace.Top) return

        // Get the block above the farmland.
        const cropBlock = targetBlock.above(1)

        // Check if it is occupied.
        if (cropBlock.identifier !== BlockIdentifier.Air) return

        // Get the data for the island the player is placing on.
        const island = Island.loadSync(player.world.identifier.slice(3))
        if (!island) return

        let error: string | null = null

        // Check if the crop has been unlocked for the island.
        if (island.getLevel() < CropLevelRequirement[this.CROP_BLOCK]!) {
            error = `Island has not unlocked this crop yet.\n§6Use §e/is crops §6to see when it unlocks.`
        }

        // Check if the limit has been reached.
        if (island.isLimitReached("crops")) {
            const limit = island.getLimit("crops")
            error = `Island has reached the crop limit §8(§4${limit.max}§8)§c.\n§dUse §e/is expand §dto increase it.`
        }

        if (error) {
            if (!MessageCooldown.has(player.xuid) || MessageCooldown.get(player.xuid)! < Date.now()) {
                player.error(error)
                MessageCooldown.set(player.xuid, Date.now() + 100)
            }
            return
        }

        // Set the use method to place.
        method = ItemUseMethod.Place

        // Set the placing block to the crop block.
        placingBlock = BlockType.get(this.CROP_BLOCK)

        // Set the block to the associated crop block.
        cropBlock.setPermutation(BlockPermutation.resolve(this.CROP_BLOCK))

        // Update the block.
        cropBlock.update()

        // Decrement the item stack.
        if (this.item.stackSize > 1) this.item.decrementStack()
        else {
            const inv = player.getTrait(EntityInventoryTrait).container
            inv.clearSlot(inv.storage.indexOf(this.item))
        }

        // Increment island limit.
        island.incrementLimit("crops", 1)
    }
}

export { ItemSeedTrait };