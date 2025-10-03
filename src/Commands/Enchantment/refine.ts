import { EntityInventoryTrait, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload, RefinementScroll, CustomEnchantEnum } from "../../Classes";
import { Utils } from "../../Utils/utils";
import { EnchantmentHandler } from "../../Handlers";

new CommandBuilder("refine", "Uses a Refinement Scroll to upgrade a CE's level.")
    .addOverload(
        new CommandOverload({
            enchantId: CustomEnchantEnum
        }).onCallback((origin, { enchantId }) => {
            if (!(origin instanceof Player)) return;
            const player = origin;

            const heldItem = player.getHeldItem();
            if (!heldItem || !heldItem.isCustomEnchanted()) {
                return player.error("This item does not have any CEs.");
            }

            const enchant = enchantId.result as string;
            const info = EnchantmentHandler.getById(enchant);
            if (!info) {
                return player.error("That enchantment does not exist.");
            }

            const currentLevel = heldItem.getCustomEnchantmentLevel(enchant);

            if (currentLevel === undefined) {
                return player.error("That enchantment is not present on your held item.");
            }

            if (currentLevel >= 6) {
                return player.error("That enchantment has already reached level 6.");
            }

            if (!player.inventory.consume(RefinementScroll.identifier, 1, { Scroll: "Refinement" })) {
                return player.error("You do not have any Refinement Scrolls.");
            }

            const levelIncrease = Utils.randomInt(1, 3);
            const newLevel = Math.min(6, currentLevel + levelIncrease);

            heldItem.setCustomEnchantmentLevel(enchant, newLevel);
            player.getTrait(EntityInventoryTrait).container.setItem(player.getSelectedSlot(), heldItem);

            player.info(`§l${info.color}${info.name}§r§6 level was increased from §7${Utils.toRomanNumeral(currentLevel)}§6 to §b${Utils.toRomanNumeral(newLevel)}§6.`);
            player.playSound("block.cartography_table.use");
        })
    )
    .register("Scrolls");