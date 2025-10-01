import { ItemStackDurabilityTrait, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";
import { Utils } from "../../Utils/utils";

new CommandBuilder("repair", "Repairs your held equipment for money.")
    .setAliases(["fix"])
    .addOverload(
        new CommandOverload({}).onCallback((player) => {
            if (!(player instanceof Player)) return

            const item = player.getHeldItem();
            const durability = item?.getTrait(ItemStackDurabilityTrait);

            if (!item || !durability) return player.error("Hold the item you want to repair.");

            if (durability.getDamage() === 0) return player.error("This item does not need to be repaired.");

            const cost = Math.ceil(durability.getDamage() * 28);
            if (player.getMoney() < cost) return player.error(`It costs §6$${Utils.formatInt(cost)} §cto repair that item.`);

            durability.setDamage(0);
            player.removeMoney(cost);
            player.info(`§bYour item has been repaired for §6$${Utils.formatInt(cost)}§b.`);
        })
    )
    .register("General");