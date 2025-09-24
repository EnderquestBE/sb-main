import { EntityInventoryTrait, Player } from "@serenityjs/core";
import { BindingScroll, CommandBuilder, CommandOverload, EnchantmentTome } from "../../Classes";
import { Utils } from "../../Utils/utils";

new CommandBuilder("binding", "Uses a Binding Scroll to increase strength of an open tome.")
    .addOverload(
        new CommandOverload({}).onCallback((origin) => {
            if (!(origin instanceof Player)) return;
            const player = origin;

            const heldItem = player.getHeldItem();
            if (!heldItem || !EnchantmentTome.is(heldItem)) {
                return player.error("You must be holding an Enchantment Tome to use this scroll.");
            }

            const currentStrength = heldItem.strength ?? 0;
            if (currentStrength >= 100) {
                return player.error("This tome is already at maximum strength.");
            }

            if (!player.inventory.consume(BindingScroll.identifier, 1, { Scroll: "Binding" })) {
                return player.error("You do not have any Binding Scrolls.");
            }

            const increase = Utils.randomInt(10, 50);
            const newStrength = Math.min(100, currentStrength + increase);
            heldItem.strength = newStrength;

            player.getTrait(EntityInventoryTrait).container.setItem(player.getSelectedSlot(), heldItem);

            player.info(`${heldItem.getDisplayName()} §6CE strength increased from §e${currentStrength}%§6 to §c${newStrength}%§6.`);
            player.playSound("block.cartography_table.use");
        })
    )
    .register("Scrolls");