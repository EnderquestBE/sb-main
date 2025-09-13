import { ItemIdentifier, ItemStackEnchantableTrait, Player } from "@serenityjs/core";
import { ShopItem } from "../../../../../Types/types";
import { ShopBuilder } from "../../../ShopBuilder";
import { ShopTransactionPage } from "../transaction";
import { ShopVanillaEnchantConfirmationPage } from "./confirmation";
import { Enchantment } from "@serenityjs/protocol";
import { Utils } from "../../../../../Utils/utils";
import { CurrencyInfo } from "../../../../../Configuration/Shop/currency";
import { EnchantmentSlot, EnchantmentSlotMap, VanillaEnchantmentSlot } from "../../../../../Configuration/config";

class ShopVanillaEnchantTransactionPage extends ShopTransactionPage {

    public constructor(shop: ShopBuilder, item: ShopItem) {
        super(shop, item);
        this.confirmPage = ShopVanillaEnchantConfirmationPage
        this.form.label(
            `Enchantment Name: ${item.display!.name}\nPrice per Level: ${item.display!.price}`
        );
        this.form.slider(
            "Select a level",
            1,
            6,
            1
        );
        this.form.input("Enter a level:", "0");
    }

    private slotAcceptsItem(item: ItemIdentifier, allowedSlots: VanillaEnchantmentSlot[]) {
        for (const slot of allowedSlots)
            if (EnchantmentSlot[slot].has(item)) return true
        return false
    }

    public checkout(player: Player, level: number, totalPrice: number) {
        const currency = this.item.currency!;
        // Check that enchantment is valid.
        let enchantable: ItemStackEnchantableTrait;
        let enchantId: Enchantment;
        try {
            const item = player.getHeldItem()
            if (!item) {
                throw new Error("You must hold the item you want to enchant.")
            }
            enchantId =
                Enchantment[this.item.id as keyof typeof Enchantment];
            if (!enchantId) throw new Error("Invalid enchantment.")
            const allowedSlots = EnchantmentSlotMap.get(enchantId)
            if (!allowedSlots || !this.slotAcceptsItem(item.identifier as ItemIdentifier, allowedSlots)) throw new Error("This enchantment cannot be applied to this item.")
            enchantable = item.hasTrait(ItemStackEnchantableTrait) ? item.getTrait(ItemStackEnchantableTrait) : item.addTrait(ItemStackEnchantableTrait);
            if (!enchantable) throw new Error("This item cannot be enchanted.")
        } catch (e: any) {
            player.error("Failed to purchase enchantment: " + e.message)
            return
        }
        // Check currency
        if (!this.checkCurrency(player, totalPrice, currency)) return
        try {
            enchantable.addEnchantment(enchantId, level);
        } catch (e: any) {
            player.error("Failed to enchant item: " + e.message)
            return
        }
        // Take currency
        this.takeCurrency(player, totalPrice, currency)
        // Rest of transaction.
        player.playSound("block.enchanting_table.use")
        player.info(`§7Enchantment succeeded: §b${this.item.display!.name} §7${Utils.toRomanNumeral(level)} §7for ${currency === "money" ? "§6" : "§a"}${CurrencyInfo[this.item.currency!].prefix + Utils.formatInt(totalPrice) + CurrencyInfo[this.item.currency!].suffix}§7.`, "shop")
    }
}

export { ShopVanillaEnchantTransactionPage };
