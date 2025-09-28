import { EntityInventoryTrait, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes"
import { SellableItems } from "../../Configuration/config";
import { Utils } from "../../Utils/utils";

new CommandBuilder("sellall", "Sells all items in your inventory.").setAliases(["sa"]).setPermissions(["rank.sellall"]).addOverload(
    new CommandOverload({
    }).onCallback((player) => {
        if (!(player instanceof Player)) return

        const inv = player.getTrait(EntityInventoryTrait).container
        const items = inv.storage.entries();

        for (const [slot, item] of items) {
            if (!item) continue;
            const sellInfo = SellableItems.get(item.type.identifier as any);
            if (!sellInfo || !sellInfo.money) continue;

            const amount = item.stackSize;
            const value = sellInfo.money * amount;
            player.inventory.clearItem(item.type.identifier, amount);
            player.addMoney(value);
            player.info(`§eSold §a${Utils.formatString(item.type.identifier)} §7x§c${amount} §efor §6$${Utils.formatInt(value)} §eat §3$${Utils.formatInt(sellInfo.money)} §eeach.`);
        }
    })
).register("Rank")