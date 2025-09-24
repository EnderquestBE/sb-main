import {
    Block,
    BlockIdentifier,
    BlockInteractionOptions,
    BlockDestroyOptions,
    BlockTrait,
    ItemIdentifier,
    EntityInventoryTrait,
    ItemStackEnchantableTrait,
} from "@serenityjs/core";
import { Utils } from "../../../Utils/utils";
import { Enchantment } from "@serenityjs/protocol";
import { BlockHandler } from "../../../Handlers/Block/handler";
import { Island } from "../../../Classes";
class BlockCropTrait extends BlockTrait {
    public static readonly identifier: string = "minecraft:crop";
    public static readonly types: Array<BlockIdentifier> = [
        BlockIdentifier.Beetroot,
        BlockIdentifier.Wheat,
        BlockIdentifier.Carrots,
        BlockIdentifier.Potatoes
    ];

    private islandName: string;

    private harvestItems!: (multiplier: number) => [item: ItemIdentifier, amount: number][];

    private harvestPoints!: () => number;

    public MAX_GROWTH: number = 7;

    public SEED_ITEM!: ItemIdentifier;

    public constructor(block: Block) {
        super(block);
        this.islandName = this.dimension.world.identifier.slice(3)
        switch (block.identifier) {
            case BlockIdentifier.Beetroot:
                this.SEED_ITEM = ItemIdentifier.BeetrootSeeds
                this.harvestItems = (multiplier: number) => { return [[this.SEED_ITEM, Utils.randomInt(1, 4) * multiplier], [ItemIdentifier.Beetroot, 1]] }
                this.harvestPoints = () => { return Utils.randomInt(0, 1) }
                break;
            case BlockIdentifier.Wheat:
                this.SEED_ITEM = ItemIdentifier.WheatSeeds
                this.harvestItems = (multiplier: number) => { return [[this.SEED_ITEM, Utils.randomInt(1, 4) * multiplier], [ItemIdentifier.Wheat, 1]] }
                this.harvestPoints = () => { return Utils.randomInt(0, 2) }
                break;
            case BlockIdentifier.Carrots:
                this.SEED_ITEM = ItemIdentifier.Carrot
                this.harvestItems = (multiplier: number) => { return [[this.SEED_ITEM, Utils.randomInt(2, 5) * multiplier]] }
                this.harvestPoints = () => { return Utils.randomInt(1, 3) }
                break;
            case BlockIdentifier.Potatoes:
                this.SEED_ITEM = ItemIdentifier.Potato
                this.harvestItems = (multiplier: number) => { return [[this.SEED_ITEM, Utils.randomInt(2, 5) * multiplier]] }
                this.harvestPoints = () => { return Utils.randomInt(1, 4) }
                break;
        }
    }

    public onRandomTick(): void {
        // Increase crop growth.
        this.grow()
    }

    public onInteract({ origin }: BlockInteractionOptions): void {
        const player = origin

        // Check if there is a player interacting.
        if (!player) return;

        // Get the item the player is holding.
        const item = player.getHeldItem()

        // Check if the player is holding bonemeal.
        if (!item || item.identifier !== ItemIdentifier.BoneMeal) return;

        // Get the current growth state of the crop.
        const growth = (this.block.getState("growth") as number)

        // Check if the block has already reached max growth.
        if (growth >= this.MAX_GROWTH) return

        // Calculate the amount of growth for the crop.
        const fertilizerGrowth = Math.floor(Math.random() * (this.MAX_GROWTH - growth)) + 1;

        // Grow the crop.
        this.grow(fertilizerGrowth)

        // Remove a piece of bonemeal from the player.
        if (item.stackSize > 1) item.decrementStack()
        else {
            const inv = player.getTrait(EntityInventoryTrait).container
            inv.clearSlot(inv.storage.indexOf(item))
        }

        // Play bone meal sound.
        player.playSound("item.bone_meal.use", { position: this.block.position })
    }

    public onBreak({ origin, dropLoot }: BlockDestroyOptions): void {

        // Prevent crops from dropping normal loot.
        dropLoot = false

        const player = origin

        // Check if a player broke the block.
        if (!player || !player.isPlayer()) return

        // Get the current growth state of the crop.
        const growth = (this.block.getState("growth") as number)

        // Get data for the island the crop is on.
        const island = Island.loadSync(this.islandName)

        if (growth < this.MAX_GROWTH) {
            player.inventory.giveItem(this.SEED_ITEM, 1)
        } else {
            // Item drops multiplier.
            let multiplier = 1;

            // Get the item the player is holding.
            const item = player.getHeldItem()

            // Check if the player's held item has fortune.
            if (item) {
                const enchantable = item.getTrait(ItemStackEnchantableTrait)
                if (enchantable) {
                    const level = enchantable.getEnchantment(Enchantment.Fortune)
                    if (level !== null && level > 0) multiplier = BlockHandler.calculateFortuneMultiplier(level)
                }
            }

            // Drop crop loot.
            player.inventory.giveItems(...this.harvestItems(multiplier))

            // Add island points.
            const points = this.harvestPoints()
            if (points > 0 && island) island.addPoints(points)
        }

        // Decrement island limit.
        if (island) island.decrementLimit("crops", 1)
    }

    public onUpdate(): void {
        // Check if there is still farmland below this crop.
        if (this.block.below(1).identifier !== BlockIdentifier.Farmland) {
            // Destroy the crop.
            this.block.destroy()

            // Decrement island limit.
            const island = Island.loadSync(this.islandName)
            if (!island) return
            island.decrementLimit("crops", 1)
        }
    }

    protected grow(amount: number = 1): void {
        // Get growth.
        const growth = (this.block.getState("growth") as number)

        // If crop has hit growth limit, ignore.
        if (growth + amount > this.MAX_GROWTH) return

        // Increase growth state.
        this.block.setState("growth", growth + amount)

        // Update block.
        this.block.update()
    }
}

export { BlockCropTrait };