import { Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";
import { Utils } from "../../Utils/utils";

new CommandBuilder("balancexp", "Shows how much XP you have.")
    .setAliases(["balxp", "myxp"])
    .addOverload(
        new CommandOverload({}).onCallback((origin) => {
            if (!(origin instanceof Player)) return
            origin.info(`§eYour XP: §a${Utils.formatInt(origin.getTotalXp())}`);
        })
    )
    .register("General");