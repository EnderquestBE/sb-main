import { EntityInventoryTrait, ItemIdentifier, ItemStack, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";
import { Utils } from "../../Utils/utils";
import { CompressableMap } from "../../Configuration/config";

new CommandBuilder("compressall", "Compresses all items in your inventory.")
    .setPermissions(["rank.compressall"])
    .setAliases(["compressall"])
    .addOverload(
        new CommandOverload({}).onCallback((player) => {
            if (!(player instanceof Player)) return

            const inv = player.getTrait(EntityInventoryTrait).container
            const items = inv.storage.entries();

            const originalAmounts: { [key in ItemIdentifier]?: number } = {};
            const amounts: { [key in ItemIdentifier]?: number } = {};
            // Check all items in inventory for compressible items.
            for (const [_, item] of items) {
                if (!item) continue;
                originalAmounts[item.identifier as ItemIdentifier] = (originalAmounts[item.identifier as ItemIdentifier] || 0) + item.stackSize;
                const compressedItem = CompressableMap.get(item.type.identifier as ItemIdentifier);
                if (!compressedItem) continue;
                const amount = Math.floor(item.stackSize / 9);
                const remainder = item.stackSize % 9;
                if (amount > 1) {
                    // Increment count for compressed and remainder items.
                    amounts[compressedItem] = (amounts[compressedItem] || 0) + amount;
                }
                if (remainder > 0) {
                    // Increment count for remainder items.
                    amounts[item.identifier as ItemIdentifier] = (amounts[item.identifier as ItemIdentifier] || 0) + remainder;
                }
                // Clear the slot.
                inv.clearSlot(item.slot);
            }
            console.log(JSON.stringify(amounts));
            if (Object.keys(amounts).length === 0) {
                return player.info("§eFound no items in your inventory to compress.");
            } else {
                // Check the remainders for additional compression.
                for (const [itemId, amount] of Object.entries(amounts)) {
                    const compressedItem = CompressableMap.get(itemId as ItemIdentifier);
                    if (!compressedItem) continue;
                    const compressAmount = Math.floor(amount / 9);
                    if (compressAmount < 1) continue;
                    const remainder = amount % 9;
                    // Update counts for compressed and remainder items.
                    amounts[compressedItem] = (amounts[compressedItem] || 0) + compressAmount;
                    if (remainder > 0) {
                        amounts[itemId as ItemIdentifier] = remainder;
                    } else {
                        delete amounts[itemId as ItemIdentifier];
                    }
                }
                console.log(JSON.stringify(amounts));
                // Add all compressed and remainder items.
                for (const [itemId, amount] of Object.entries(amounts)) {
                    inv.addItem(new ItemStack(itemId as ItemIdentifier, { stackSize: amount }));
                    const result = CompressableMap.get(itemId as ItemIdentifier);
                    const originalAmount = originalAmounts[itemId as ItemIdentifier];
                    if (result && originalAmount)
                        player.info(`§6Compressed §a${Utils.formatString(itemId)} §7x§c${originalAmount} §6into §e${Utils.formatString(result)} §7x§c${amounts[result]}§6.`);
                }
            }
        })
    )
    .register("General");