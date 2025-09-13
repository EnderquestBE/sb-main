import { Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes/classes";
import { Utils } from "../../Utils/utils";

new CommandBuilder("balance", "Shows how much money you have.")
    .setAliases(["bal", "mymoney"])
    .addOverload(
        new CommandOverload({}).onCallback((origin) => {
            if (!(origin instanceof Player)) return
            origin.info(`§eYour Balance: §6$${Utils.formatInt(origin.getMoney())}`);
        })
    )
    .register("General");