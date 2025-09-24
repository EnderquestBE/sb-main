import { EntityInventoryTrait, ItemStackDurabilityTrait, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload, RestorationScroll } from "../../Classes";
import { Utils } from "../../Utils/utils";
import { Enchantment } from "@serenityjs/protocol";

new CommandBuilder("restore", "Uses a Restoration Scroll to restore an item's durability.")
    .addOverload(
        new CommandOverload({}).onCallback((origin) => {
            if (!(origin instanceof Player)) return;
            const player = origin;

            const heldItem = player.getHeldItem();

            if (!heldItem || !(heldItem.getTrait(ItemStackDurabilityTrait))) {
                return player.error("This item cannot be repaired.");
            }

            const durable = heldItem.getTrait(ItemStackDurabilityTrait);
            if (durable.getDamage() === 0) {
                return player.error("This item is not damaged.");
            }

            if (!player.inventory.consume(RestorationScroll.identifier, 1, { Scroll: "Restoration" })) {
                return player.error("You do not have any Restoration Scrolls.");
            }

            durable.setDamage(0);

            player.getTrait(EntityInventoryTrait).container.setItem(player.getSelectedSlot(), heldItem);

            player.info(`§b${heldItem.getDisplayName() === "" ? Utils.formatString(heldItem.identifier) : heldItem.getDisplayName()} §ewas restored to §dfull §edurability.`);
            player.playSound("block.cartography_table.use");
        })
    )
    .register("Scrolls");