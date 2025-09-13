import { ItemStack, Player } from "@serenityjs/core";
import { ShopItem } from "../../../../../Types/types";
import { ShopBuilder } from "../../../ShopBuilder";
import { ShopTransactionPage } from "../transaction";
import { ShopItemConfirmationPage } from "./confirmation";
import { CurrencyInfo } from "../../../../../Configuration/Shop/currency";
import { Utils } from "../../../../../Utils/utils";

class ShopItemTransactionPage extends ShopTransactionPage {

    public constructor(shop: ShopBuilder, item: ShopItem) {
        super(shop, item);
        this.confirmPage = ShopItemConfirmationPage
        this.form.label(
            `Item Name: ${item.display!.name}\nItem Price: ${item.display!.price}`
        );
        this.form.slider(
            "Select an amount",
            1,
            item.slider!.max,
            item.slider!.step
        );
        this.form.input("Enter an amount:", "0");
    }

    public checkout(player: Player, amount: number, totalPrice: number) {
        const currency = this.item.currency!;
        // Construct item.
        let item: ItemStack;
        try {
            if (this.item.item) item = this.item.item;
            else item = new ItemStack(this.item.id, { stackSize: amount });
        } catch (e) {
            player.error("You were unable to purchase this item.")
            return
        }
        // Check currency
        if (!this.checkCurrency(player, totalPrice, currency)) return
        const inventory = player.inventory
        try {
            // Give item.
            inventory.addItem(item, amount);
        } catch (e) {
            return player.error("Transaction failed. Try again later.")
        }
        // Take currency
        this.takeCurrency(player, totalPrice, currency)
        // Rest of transaction.
        if (this.item.transactionSound) player.playSound(this.item.transactionSound)
        player.info(`§7Successfully purchased §e${this.item.display!.name} §7x§c${amount} §7for ${currency === "money" ? "§6" : "§a"}${CurrencyInfo[this.item.currency!].prefix + Utils.formatInt(totalPrice) + CurrencyInfo[this.item.currency!].suffix}§7.`, "shop")
    }
}

export { ShopItemTransactionPage };
