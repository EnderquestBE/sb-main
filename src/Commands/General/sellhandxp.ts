import { EntityInventoryTrait, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";
import { SellableItems } from "../../Configuration/config";
import { Utils } from "../../Utils/utils";

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

            const amount = item.stackSize;
            const value = sellInfo.xp * amount;
            inv.clearSlot(player.getSelectedSlot());
            player.addXp(value);
            player.info(`§eSold §a${Utils.formatString(item.type.identifier)} §7x§c${amount} §efor §a${Utils.formatInt(value)} XP §eat §3${Utils.formatInt(sellInfo.xp)} XP §eeach.`);
        })
    )
    .register("General");