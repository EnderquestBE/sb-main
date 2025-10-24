import { ItemStackDurabilityTrait, Player, StringEnum } from "@serenityjs/core";
import { CommandBuilder, CommandOverload, Filter } from "../../Classes";
import { Utils } from "../../Utils/utils";

new CommandBuilder("rename", "Renames your held item.")
    .setAliases(["rename"])
    .setPermissions(["rank.rename"])
    .addOverload(
        new CommandOverload({
            name: StringEnum
        }).onCallback((player, { name: nameRaw }) => {
            if (!(player instanceof Player)) return

            const item = player.getHeldItem();

            if (!item) return player.error("Hold the item you want to rename.");

            // Only allow equipment items to be renamed.
            if (!item.hasTrait(ItemStackDurabilityTrait)) {
                return player.error("Only equipment items can be renamed.");
            }

            //@ts-ignore
            let name = nameRaw.result;
            if (!name || name.length > 40) return player.error("Name must be between 1 and 40 characters.");

            if (Filter.contains(name)) {
                name = Filter.censor(name);
            } else if (/^[a-zA-Z0-9 _!?#@$&:()\-]+$/.test(name) === false) {
                return player.error("Name may only contain letters, numbers, and basic symbols.");
            }

            name = "§r§c" + name;

            const cost = 5000;
            if (player.getMoney() < cost) return player.error(`It costs §6$${Utils.formatInt(cost)} §cto rename an item.`);

            item.setDisplayName(name);
            player.removeMoney(cost);
            player.info(`§eYour item has been renamed to §7'§c${name}§7' §efor §6$${Utils.formatInt(cost)}§e.`);
        })
    )
    .register("Rank");