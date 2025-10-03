import { IntegerEnum, ItemStackDurabilityTrait, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";
import { Utils } from "../../Utils/utils";

new CommandBuilder("repair", "Repairs your held equipment for money.")
    .setAliases(["fix"])
    .setPermissions(["rank.repair"])
    .addOverload(
        new CommandOverload({
            amount: [IntegerEnum, true]
        }).onCallback((player, { amount: amountRaw }) => {
            if (!(player instanceof Player)) return

            //@ts-ignore
            const amount = amountRaw.result ?? 100;
            if (amount < 1 || amount > 100) return player.error("Amount must be a % of the item's durability to repair.");

            const item = player.getHeldItem();
            const durability = item?.getTrait(ItemStackDurabilityTrait);

            if (!item || !durability) return player.error("Hold the item you want to repair.");

            if (durability.getDamage() === 0) return player.error("This item does not need to be repaired.");

            // Calculate repair cost based on
            const cost = Math.ceil((durability.getDamage() * (amount / 100)) * 28);
            if (player.getMoney() < cost) return player.error(`It costs §6$${Utils.formatInt(cost)} §cto repair that item${amount < 100 ? ` for §e${amount}%%§c` : ""}.`);

            durability.setDamage(0);
            player.removeMoney(cost);
            player.info(`§bYour item has been repaired${amount < 100 ? ` by §e${amount}%%§b` : ""} for §6$${Utils.formatInt(cost)}§b.`);
        })
    )
    .register("Rank");