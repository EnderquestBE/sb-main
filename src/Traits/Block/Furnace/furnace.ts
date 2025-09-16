import {
    Block,
    BlockIdentifier,
    BlockInteractionOptions,
    BlockPermutation,
    GenericBlockState,
    ItemStack,
    ActionForm,
    EntityInventoryTrait,
    ItemIdentifier,
    BlockDestroyOptions,
    BlockTrait,
} from "@serenityjs/core";
import { CompoundTag, IntTag, StringTag } from "@serenityjs/nbt";
import { Utils } from "../../../Utils/utils";
import { ItemSmeltableMap } from "../../../Configuration/Smelting/smelting";

class BlockFurnaceTrait extends BlockTrait {
    public static readonly identifier: string = "minecraft:furnace";
    public static readonly types: Array<BlockIdentifier> = [
        BlockIdentifier.Furnace,
        BlockIdentifier.LitFurnace
    ];

    public constructor(block: Block) {
        super(block);
    }

    public onInteract({ origin }: BlockInteractionOptions): void {

        const player = origin!

        // Display form.
        const form = new ActionForm("Furnace")
        form.content = "Tap an item to smelt it."
        let smeltingItem: { item: string, amount: number, start: number } | null = null
        // Populate active item.
        smeltingItem = this.getItemSmelting()
        if (smeltingItem) {
            // Update the display timer.
            function updateSmeltingData() {
                if (!smeltingItem) return
                const timeRemaining = ((smeltingItem.start + (smeltingItem.amount * 10)) - Math.floor(Date.now() / 1000))
                form.content = `Tap an item to smelt it.\n§6Time Remaining: §7${timeRemaining > 0 ? Utils.formatTime(timeRemaining) : "§aCompleted"}`
                const finishedItems = Math.min(Math.floor(((Date.now() / 1000) - smeltingItem.start) / 10), smeltingItem.amount)
                if (finishedItems === smeltingItem.amount) form.buttons[0] = { text: `${Utils.formatString(smeltingItem.item)} x§6${finishedItems}` }
                else form.buttons[0] = { text: `${Utils.formatString(smeltingItem.item)} x§c${smeltingItem.amount - finishedItems}§r - x§6${finishedItems}` }
                form.update(player)
                if (timeRemaining > 0) setTimeout(updateSmeltingData, 1000)
            }
            updateSmeltingData()
        }
        const inv = player.getTrait(EntityInventoryTrait).container
        const invItems = inv.storage
        const smeltableItems: ItemStack[] = []
        // Display smeltable items.
        for (const item of invItems) {
            if (!item) continue
            const smeltable = ItemSmeltableMap.get(item.identifier as ItemIdentifier)
            if (!smeltable) continue
            form.button(`${Utils.formatString(item.identifier)} x§c${item.stackSize} §r-> §6${Utils.formatString(smeltable)}`)
            smeltableItems.push(item)
        }
        form.show(player, (result, _error) => {
            if (result === null) return
            if (result === 0) {
                // Collect smelted item.
                if (smeltingItem) {
                    smeltingItem = this.getItemSmelting()!
                    const finishedItems = Math.floor(((Date.now() / 1000) - smeltingItem.start) / 10)
                    const smeltedItem = ItemSmeltableMap.get(smeltingItem.item as ItemIdentifier)
                    if (!smeltedItem) {
                        player.error("Failed to smelt item.")
                        this.clearItemSmelting()
                        return
                    }
                    if (finishedItems <= 0) return
                    // If items are not all done smelting, extract part.
                    else if (finishedItems < smeltingItem.amount) {
                        const newFurnaceItem = new ItemStack(smeltingItem.item, { stackSize: smeltingItem.amount - finishedItems })
                        this.setItemSmelting(newFurnaceItem)
                        player.inventory.giveItem(smeltedItem, finishedItems)
                    } else {
                        // If items are done smelting, extract all.
                        this.clearItemSmelting()
                        player.inventory.giveItem(smeltedItem, smeltingItem.amount)
                    }
                    return
                }
                else result++
            }
            // Only allow smelting one item at a time.
            if (smeltingItem) {
                player.error("You can only smelt one item at a time.")
                return
            }
            // Start smelting.
            const item = smeltableItems[result - 1]
            if (!item) {
                player.error("Failed to queue item for smelting.")
                return
            }
            this.setItemSmelting(item)
            inv.clearSlot(invItems.indexOf(item))
        })
    }

    public onBreak({ origin }: BlockDestroyOptions): void {
        const smeltingItem = this.getItemSmelting()
        if (!smeltingItem || !origin?.isPlayer()) return
        const player = origin
        const smeltedItem = ItemSmeltableMap.get(smeltingItem.item as ItemIdentifier)!
        const finishedItems = Math.floor(((Date.now() / 1000) - smeltingItem.start) / 10)
        if (finishedItems > 0) player.inventory.giveItem(smeltedItem, finishedItems)
        const leftoverItems = smeltingItem.amount - finishedItems
        if (leftoverItems > 0) player.inventory.giveItem(smeltingItem.item, leftoverItems)
        this.clearItemSmelting()
    }

    public getItemSmelting() {
        const smeltTag = this.block.nbt.get<CompoundTag>("Smelt")
        if (smeltTag) {
            const itemTag = smeltTag.get<StringTag>("Item")
            const amountTag = smeltTag.get<IntTag>("Amount")
            const startTag = smeltTag.get<StringTag>("Start")

            if (!itemTag || !amountTag || !startTag) return null

            return { item: itemTag.valueOf(), amount: amountTag.valueOf(), start: Math.floor(new Date(startTag.valueOf()).getTime() / 1000) }
        }
        return null
    }

    public setItemSmelting(item: ItemStack) {
        this.transform(true)
        const existingSmeltTag = this.block.nbt.get<CompoundTag>("Smelt")
        if (existingSmeltTag) {
            this.block.nbt.delete("Smelt")
        }

        const smeltTag = new CompoundTag()
        const itemTag = new StringTag(item.identifier, "Item")
        const amountTag = new IntTag(item.stackSize, "Amount")
        const startTag = new StringTag(new Date().toISOString(), "Start")

        smeltTag.push(itemTag)
        smeltTag.push(amountTag)
        smeltTag.push(startTag)

        this.block.nbt.set("Smelt", smeltTag)

        this.block.nbt.update();
    }

    public clearItemSmelting() {
        this.block.nbt.clear()
        this.transform(false)
    }

    protected transform(lit: boolean): void {
        if (lit) {
            // Get the permutation for the lit furnace block
            const permutation = BlockPermutation.resolve(
                BlockIdentifier.LitFurnace,
                this.block.getPermutation().state as GenericBlockState
            );
            // Set the block permutation
            this.block.setPermutation(permutation);
        } else {
            // Get the permutation for the furnace block
            const permutation = BlockPermutation.resolve(
                BlockIdentifier.Furnace,
                this.block.getPermutation().state as GenericBlockState
            );
            // Set the block permutation
            this.block.setPermutation(permutation);
        }
    }
}

export { BlockFurnaceTrait };