import { Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes/classes";
import { SellableItems } from "../../Configuration/config";
import { Utils } from "../../Utils/utils";

new CommandBuilder("sellhandxp", "Sells the item in your hand for xp.")
    .setAliases(["shxp"])
    .addOverload(
        new CommandOverload({}).onCallback((origin) => {
            if (!(origin instanceof Player)) return
            const item = origin.getHeldItem();

            if (!item) {
                return origin.error("Hold the item you would like to sell.");
            }
            const sellInfo = SellableItems.get(item.type.identifier as any);
            if (!sellInfo || !sellInfo.xp) {
                return origin.error("This item cannot be sold.");
            }

            const amount = item.stackSize;
            const value = sellInfo.xp * amount;
            origin.inventory.clearItem(item.type.identifier, amount);
            origin.addXp(value);
            origin.info(`§eSold §a${Utils.formatString(item.type.identifier)} §7x§c${amount} §efor §a${Utils.formatInt(value)} XP §eat §3${Utils.formatInt(sellInfo.xp)} XP §eeach.`);
        })
    )
    .register("General");