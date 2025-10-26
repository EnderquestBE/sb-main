import { EntityInventoryTrait, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes"
import { SellableItems } from "../../Configuration/config";
import { Utils } from "../../Utils/utils";
import { Server } from "../../server";

new CommandBuilder("sellall", "Sells all items in your inventory.").setAliases(["sa", "sellinv"]).setPermissions(["rank.sellall"]).addOverload(
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
            if (!sellInfo || !sellInfo.money) continue;

            const amount = item.getStackSize();
            const value = Math.floor(sellInfo.money * amount * multiplier);
            total += value;
            player.inventory.clearItem(item.type.identifier, amount);
            player.info(`§eSold §a${Utils.formatString(item.type.identifier)} §7x§c${amount} §efor §6$${Utils.formatInt(value)} §eat §3$${Utils.formatInt(Math.floor(sellInfo.money * multiplier))} §eeach.`);
        }
        if (total > 0) player.addMoney(Math.floor(total));
        else player.info("§eFound no items in your inventory to sell.");
    })
).register("Rank")