import { Player, StringEnum } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";
import { MainShop } from "../../Configuration/Shop/Main/main";
import { ShopItemTransactionPage } from "../../Classes/Shop/Pages/Form/Item/itemTransaction";

new CommandBuilder("buy", "Purchase an item from the shop directly by name.")
    .addOverload(
        new CommandOverload({ item: StringEnum }).onCallback((player, { item: itemID }) => {
            if (!(player instanceof Player)) return

            // Get shop item info if it exists.
            const info = MainShop.items.get(itemID.result!.indexOf(":") === -1 ? `minecraft:${itemID.result}` : itemID.result!);
            if (!info) return player.error("That item is not currently available for purchase.");

            // Show transaction page.
            new (info.transactionType ?? ShopItemTransactionPage)(MainShop, info).show(player);
        })
    )
    .register("General");