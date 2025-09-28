import { EntityInventoryTrait, ItemStackEnchantableTrait, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload, TemperamentScroll, VanillaEnchantEnum } from "../../Classes";
import { Utils } from "../../Utils/utils";
import { Enchantment } from "@serenityjs/protocol";

new CommandBuilder("temper", "Uses a Temperament Scroll to upgrade a VE's level.")
    .addOverload(
        new CommandOverload({
            enchantId: VanillaEnchantEnum
        }).onCallback((origin, { enchantId }) => {
            if (!(origin instanceof Player)) return;
            const player = origin;

            const heldItem = player.getHeldItem();
            if (!heldItem || !(heldItem.getTrait(ItemStackEnchantableTrait)?.getEnchantments().size > 0)) {
                return player.error("This item is not enchanted.");
            }

            const enchant = enchantId.result as string;

            if (!(enchant in Enchantment)) {
                return player.error("That enchantment does not exist.");
            }

            const enchantable = heldItem.getTrait(ItemStackEnchantableTrait)
            if (!enchantable?.hasEnchantment(Enchantment[enchant as keyof typeof Enchantment])) {
                return player.error("That enchantment is not present on your held item.");
            }

            const currentLevel = enchantable.getEnchantment(Enchantment[enchant as keyof typeof Enchantment]);

            if (currentLevel === null) {
                return player.error("That enchantment is not present on your held item.");
            }

            if (currentLevel >= 10) {
                return player.error("That enchantment has already reached the maximum level of 10.");
            }

            if (!player.inventory.consume(TemperamentScroll.identifier, 1, { Scroll: "Temperament" })) {
                return player.error("You do not have any Temperament Scrolls.");
            }

            const levelIncrease = Utils.randomInt(1, 3);
            const newLevel = Math.min(10, currentLevel + levelIncrease);

            enchantable.setEnchantment(Enchantment[enchant as keyof typeof Enchantment], newLevel);
            player.getTrait(EntityInventoryTrait).container.setItem(player.getSelectedSlot(), heldItem);

            player.info(`§7${enchant} §6level was increased from §7${Utils.toRomanNumeral(currentLevel)}§6 to §b${Utils.toRomanNumeral(newLevel)}§6.`);
            player.playSound("block.cartography_table.use");
        })
    )
    .register("Scrolls");