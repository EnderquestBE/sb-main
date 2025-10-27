import { EntityInventoryTrait, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes"
import { SellableItems } from "../../Configuration/config";
import { Utils } from "../../Utils/utils";
import { Server } from "../../server";

new CommandBuilder("sellallxp", "Sells all items in your inventory.").setAliases(["saxp", "sellinvxp"]).setPermissions(["rank.sellallxp"]).addOverload(
    new CommandOverload({
    }).onCallback((player) => {
        if (!(player instanceof Player)) return

        const inv = player.getTrait(EntityInventoryTrait).container
        const items = inv.storage.entries();

        const multiplier = Server.globalMultiplier;
        let total = 0;
        for (const [_, item] of items) {
            if (!item) continue;
            const sellInfo = SellableItems.get(item.type.identifier as any);
            if (!sellInfo || !sellInfo.xp) continue;

            const amount = item.stackSize;
            const value = Math.floor(sellInfo.xp * amount * multiplier);
            total += value;
            player.inventory.clearItem(item.type.identifier, amount);
            player.info(`§eSold §a${Utils.formatString(item.type.identifier)} §7x§c${amount} §efor §a${Utils.formatInt(value)} XP §eat §3${Utils.formatInt(Math.floor(sellInfo.xp * multiplier))} XP §eeach.`);
        }
        if (total > 0) player.addXp(Math.floor(total));
        else player.info("§eFound no items in your inventory to sell.");
    })
).register("Rank")