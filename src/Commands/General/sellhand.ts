import { EntityInventoryTrait, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";
import { SellableItems } from "../../Configuration/config";
import { Utils } from "../../Utils/utils";
import { Server } from "../../server";

new CommandBuilder("sellhand", "Sells the item in your hand.")
    .setAliases(["sh"])
    .addOverload(
        new CommandOverload({}).onCallback((player) => {
            if (!(player instanceof Player)) return

            const inv = player.getTrait(EntityInventoryTrait).container;

            const item = player.getHeldItem();

            if (!item) {
                return player.error("Hold the item you would like to sell.");
            }
            const sellInfo = SellableItems.get(item.type.identifier as any);
            if (!sellInfo || !sellInfo.money) {
                return player.error("This item cannot be sold.");
            }

            const multiplier = Server.globalMultiplier;
            const amount = item.stackSize;
            const value = Math.floor(sellInfo.money * amount * multiplier);
            inv.clearSlot(player.getSelectedSlot());
            player.addMoney(value);
            player.info(`§eSold §a${Utils.formatString(item.type.identifier)} §7x§c${amount} §efor §6$${Utils.formatInt(value)} §eat §3$${Utils.formatInt(Math.floor(sellInfo.money * multiplier))} §eeach.`);
        })
    )
    .register("General");