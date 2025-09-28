import { Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";
import { SellableItems } from "../../Configuration/config";
import { Utils } from "../../Utils/utils";

new CommandBuilder("sellhand", "Sells the item in your hand.")
    .setAliases(["sh"])
    .addOverload(
        new CommandOverload({}).onCallback((origin) => {
            if (!(origin instanceof Player)) return
            const item = origin.getHeldItem();

            if (!item) {
                return origin.error("Hold the item you would like to sell.");
            }
            const sellInfo = SellableItems.get(item.type.identifier as any);
            if (!sellInfo || !sellInfo.money) {
                return origin.error("This item cannot be sold.");
            }

            const amount = item.stackSize;
            const value = sellInfo.money * amount;
            origin.inventory.clearItem(item.type.identifier, amount);
            origin.addMoney(value);
            origin.info(`§eSold §a${Utils.formatString(item.type.identifier)} §7x§c${amount} §efor §6$${Utils.formatInt(value)} §eat §3$${Utils.formatInt(sellInfo.money)} §eeach.`);
        })
    )
    .register("General");