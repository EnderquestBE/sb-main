import { EntityInventoryTrait, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";
import { SellableItems } from "../../Configuration/config";
import { Utils } from "../../Utils/utils";
import { Server } from "../../server";

new CommandBuilder("sellhandxp", "Sells the item in your hand for xp.")
    .setAliases(["shxp"])
    .addOverload(
        new CommandOverload({}).onCallback((player) => {
            if (!(player instanceof Player)) return;

            const inv = player.getTrait(EntityInventoryTrait).container;

            const item = player.getHeldItem();

            if (!item) {
                return player.error("Hold the item you would like to sell.");
            }
            const sellInfo = SellableItems.get(item.type.identifier as any);
            if (!sellInfo || !sellInfo.xp) {
                return player.error("This item cannot be sold.");
            }

            const multiplier = Server.globalMultiplier;
            const amount = item.getStackSize();
            const value = Math.floor(sellInfo.xp * amount * multiplier);
            inv.clearSlot(player.getSelectedSlot());
            player.addXp(value);
            player.info(`§eSold §a${Utils.formatString(item.type.identifier)} §7x§c${amount} §efor §a${Utils.formatInt(value)} XP §eat §3${Utils.formatInt(sellInfo.xp * multiplier)} XP §eeach.`);
        })
    )
    .register("General");