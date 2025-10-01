import { EntityInventoryTrait, ItemIdentifier, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload, EnchantmentTome } from "../../Classes";
import { CompoundTag, ShortTag, StringTag } from "@serenityjs/nbt";
import { EnchantmentHandler } from "../../Handlers/Enchantment/handler";
import { EnchantmentSlot } from "../../Configuration/config";
import { Utils } from "../../Utils/utils";

new CommandBuilder("merge", "Combines enchantment tomes in your inventory onto your held item.")
    .addOverload(
        new CommandOverload({}).onCallback((origin) => {
            if (!(origin instanceof Player)) return;

            const player = origin as Player;
            const heldItem = player.getHeldItem();

            if (!heldItem) {
                return player.error("You must be holding an item to apply enchantments to.");
            }

            const inventory = player.getTrait(EntityInventoryTrait).container

            // Allow merging two tomes of the same enchantment to increase strength.
            if (EnchantmentTome.is(heldItem)) {

                const heldTomeNBT = heldItem.nbt.get<CompoundTag>("EnchantmentTome");
                if (!heldTomeNBT) {
                    return player.error("That item is not a valid tome.");
                }

                const heldEnchantId = heldTomeNBT.get<StringTag>("Enchantment")?.valueOf();
                const heldStrength = heldTomeNBT.get<ShortTag>("Strength")?.valueOf();

                if (!heldEnchantId || heldStrength === undefined) {
                    return player.error("That item is not a valid tome.");
                }

                if (heldStrength >= 100) {
                    return player.error("That tome already at maximum strength.");
                }

                for (const [slot, item] of inventory.storage.entries()) {
                    if (!item || slot === player.getSelectedSlot()) continue;

                    // Check if the item is an Enchantment Tome by its NBT data
                    const tomeNBT = item.nbt.get<CompoundTag>("EnchantmentTome");
                    if (!tomeNBT) continue;

                    // Get tome data.
                    const enchantId = tomeNBT.get<StringTag>("Enchantment")?.valueOf();
                    const strength = tomeNBT.get<ShortTag>("Strength")?.valueOf();

                    if (!enchantId || strength === undefined) continue;

                    // Get enchantment info
                    const enchantInfo = EnchantmentHandler.getById(enchantId);
                    if (!enchantInfo) continue;

                    const enchantDisplayName = `§l${enchantInfo.color}${enchantInfo.name}§r`

                    player.info(`§6> ${enchantDisplayName} §eis interacting with the item...`);

                    if (enchantId !== heldEnchantId) {
                        player.info(`§c> ${enchantDisplayName} §cis a different enchantment than your tome.`);
                        continue;
                    }

                    if (heldStrength >= 100) {
                        player.info(`§c> ${enchantDisplayName} §cis already at maximum strength.`);
                        continue;
                    }

                    heldItem.strength = Math.min(100, heldStrength + strength);
                    inventory.clearSlot(slot);
                    heldItem.update();
                    player.info(`§a> ${enchantDisplayName} §ehas merged with another tome powering a new strength of §c${heldItem.strength}%%§e!`);
                    return;
                }
                return;
            }

            let tomeCount = 0;
            for (const [slot, item] of inventory.storage.entries()) {
                if (!item || slot === player.getSelectedSlot()) continue;

                // Check if the item is an Enchantment Tome by its NBT data
                const tomeNBT = item.nbt.get<CompoundTag>("EnchantmentTome");
                if (!tomeNBT) continue;

                // Get tome data.
                const enchantId = tomeNBT.get<StringTag>("Enchantment")?.valueOf();
                const strength = tomeNBT.get<ShortTag>("Strength")?.valueOf();

                if (!enchantId || strength === undefined) continue;

                // Get enchantment info
                const enchantInfo = EnchantmentHandler.getById(enchantId);
                if (!enchantInfo) continue;

                const enchantDisplayName = `§l${enchantInfo.color}${enchantInfo.name}§r`

                // Show trying to merge message.
                player.info(`§6> ${enchantDisplayName} §eis interacting with the item...`);
                tomeCount++;

                // Check if the held item already has the enchantment.
                if (heldItem.hasCustomEnchantment(enchantId)) {
                    player.info(`§c> ${enchantDisplayName} §cis already present on the item.`);
                    continue;
                }

                // Check if the enchantment slot matches the item.
                const isCompatibleSlot = enchantInfo.slots.some(slotType => EnchantmentSlot[slotType].has(heldItem.type.identifier as ItemIdentifier));
                if (!isCompatibleSlot) {
                    player.info(`§c> ${enchantDisplayName} §ccannot be used on this item type.`);
                    continue;
                }

                // Check for incompatible enchantments on the held item.
                const hasIncompatibleEnchant = enchantInfo.incompatible.some(id => heldItem.hasCustomEnchantment(id));
                if (hasIncompatibleEnchant) {
                    const incompatibleNames = enchantInfo.incompatible.filter(id => heldItem.hasCustomEnchantment(id)).map(id => EnchantmentHandler.getById(id)?.name ?? id).join(", ");
                    player.info(`§c> ${enchantDisplayName} §cis incompatible with: §e${incompatibleNames}§c.`);
                    continue;
                }

                // Select a random enchantment level 1-5.
                const level = Utils.randomInt(1, 5);

                // Show progress message.
                player.info(`§6> ${enchantDisplayName} §7${Utils.toRomanNumeral(level)} §fis attempting to merge with the item...`);

                // Roll for success. VEGAS, BABYY!!!!
                const roll = Math.random() * 100;
                if (roll <= strength) {
                    // Success
                    const result = heldItem.addCustomEnchantment(enchantId, level);
                    if (result.success) {
                        inventory.clearSlot(slot);
                        player.info(`§a> ${enchantDisplayName} §ehas been successfully enchanted onto the item!`);
                    } else {
                        // Failed to add, show error.
                        player.info(`§c${result.error?.message || result.error}`);
                        return;
                    }
                } else {
                    // 30% chance to lose enchantment.
                    if (Math.random() <= 0.30) {
                        inventory.clearSlot(slot);
                        player.info(`§c> ${enchantDisplayName} §cwas too unstable and was destroyed by the item.`);
                    } else {
                        player.info(`§a> ${enchantDisplayName} §cwas too unstable and failed to merge.`);
                    }
                }
            }

            if (tomeCount === 0) {
                return player.info("§cNo valid tomes were found in your inventory.");
            }

            // Update item.
            heldItem.update();
        })
    )
    .register("Enchantment");
