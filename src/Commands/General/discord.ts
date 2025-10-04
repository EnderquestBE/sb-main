import { Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes"

new CommandBuilder("discord", "Shows our discord invite.").addOverload(
    new CommandOverload({
    }).onCallback((player) => {
        if (!(player instanceof Player)) return;
        player.info("§dJoin the Discord: §9https://ender.quest/discord");
    })
).register("General")