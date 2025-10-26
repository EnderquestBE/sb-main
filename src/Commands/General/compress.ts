import { EntityInventoryTrait, ItemIdentifier, ItemStack, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";
import { Utils } from "../../Utils/utils";
import { CompressableMap } from "../../Configuration/config";

new CommandBuilder("compress", "Compresses the item in your hand.")
    .setAliases(["compress"])
    .addOverload(
        new CommandOverload({}).onCallback((player) => {
            if (!(player instanceof Player)) return

            const inv = player.getTrait(EntityInventoryTrait).container;

            const item = player.getHeldItem();

            if (!item) {
                return player.error("Hold the item you would like to compress.");
            }

            const compressAmount = item.getStackSize();
            const compressedItem = CompressableMap.get(item.type.identifier as ItemIdentifier);
            if (!compressedItem) {
                return player.error("This item cannot be compressed.");
            }
            const amount = Math.floor(item.getStackSize() / 9);
            if (amount < 1) {
                return player.error("You do not have enough of this item to compress.");
            }
            const remainder = item.getStackSize() % 9;
            // Take items from hand.
            if (remainder === 0) {
                inv.clearSlot(player.getSelectedSlot());
            } else {
                item.setStackSize(remainder);
            }
            // Add compressed item.
            inv.addItem(new ItemStack(compressedItem, { stackSize: amount }));
            player.info(`§6Compressed §a${Utils.formatString(item.type.identifier)} §7x§c${compressAmount} §6into §e${Utils.formatString(compressedItem)} §7x§c${amount}§6.`);
        })
    )
    .register("General");