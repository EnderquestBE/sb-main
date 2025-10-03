import { EntityInventoryTrait, ItemStackEnchantableTrait, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload, EnchantmentTome, ExpulsionScroll, AllEnchantEnum } from "../../Classes";
import { EnchantmentHandler } from "../../Handlers";
import { Enchantment } from "@serenityjs/protocol";

new CommandBuilder("expel", "Uses an Expulsion Scroll to remove an enchant from item.")
    .addOverload(
        new CommandOverload({
            enchantId: AllEnchantEnum
        }).onCallback((origin, { enchantId }) => {
            if (!(origin instanceof Player)) return;
            const player = origin;

            const heldItem = player.getHeldItem();
            if (!heldItem || !(heldItem.isCustomEnchanted() || heldItem.getTrait(ItemStackEnchantableTrait)?.getEnchantments().size > 0)) {
                return player.error("This item is not enchanted.");
            }

            const enchant = enchantId.result as string;
            const info = EnchantmentHandler.getById(enchant)
            // Custom enchantment logic
            if (info) {
                if (!heldItem.hasCustomEnchantment(enchant)) {
                    return player.error("That enchantment is not present on your held item.");
                }

                if (!player.inventory.consume(ExpulsionScroll.identifier, 1, { Scroll: "Expulsion" })) {
                    return player.error("You do not have any Expulsion Scrolls.");
                }

                heldItem.removeCustomEnchantment(enchant);

                // 50% chance to refund enchantment as tome.
                if (Math.random() < 0.5) {
                    const tome = new EnchantmentTome(enchant);
                    player.inventory.addItem(tome);
                }

                player.info(`§l${info.color}${info.name}§r§6 was §cexpelled §6from the item.`);
            } else {
                // Vanilla enchantment logic
                if (!(enchant in Enchantment)) {
                    return player.error("That enchantment does not exist.");
                }

                const enchantable = heldItem.getTrait(ItemStackEnchantableTrait)
                if (!enchantable?.hasEnchantment(Enchantment[enchant as keyof typeof Enchantment])) {
                    return player.error("That enchantment is not present on your held item.");
                }

                if (!player.inventory.consume(ExpulsionScroll.identifier, 1, { Scroll: "Expulsion" })) {
                    return player.error("You do not have any Expulsion Scrolls.");
                }

                enchantable.removeEnchantment(Enchantment[enchant as keyof typeof Enchantment]);
                if (enchantable.getEnchantments().size === 0) {
                    heldItem.removeTrait(ItemStackEnchantableTrait);
                }

                player.info(`§7${enchant} §6was §cexpelled §6from the item.`);
            }

            player.getTrait(EntityInventoryTrait).container.setItem(player.getSelectedSlot(), heldItem);
            player.playSound("block.cartography_table.use");
        })
    )
    .register("Scrolls");