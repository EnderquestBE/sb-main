import { EntityInventoryTrait, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes"
import { SellableItems } from "../../Configuration/config";
import { Utils } from "../../Utils/utils";

new CommandBuilder("sellallxp", "Sells all items in your inventory.").setAliases(["saxp", "sellinvxp"]).setPermissions(["rank.sellallxp"]).addOverload(
    new CommandOverload({
    }).onCallback((player) => {
        if (!(player instanceof Player)) return

        const inv = player.getTrait(EntityInventoryTrait).container
        const items = inv.storage.entries();

        for (const [slot, item] of items) {
            if (!item) continue;
            const sellInfo = SellableItems.get(item.type.identifier as any);
            if (!sellInfo || !sellInfo.xp) continue;

            const amount = item.stackSize;
            const value = sellInfo.xp * amount;
            player.inventory.clearItem(item.type.identifier, amount);
            player.addXp(value);
            player.info(`§eSold §a${Utils.formatString(item.type.identifier)} §7x§c${amount} §efor §a${Utils.formatInt(value)} XP §eat §3${Utils.formatInt(sellInfo.xp)} XP §eeach.`);
        }
    })
).register("Rank")