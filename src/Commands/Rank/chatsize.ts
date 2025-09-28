import { Entity } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes"

new CommandBuilder("chatsize", "Changes the size of your chat messages.").setAliases(["cs"]).setPermissions(["rank.chatsize"]).addOverload(
    new CommandOverload({
    }).onCallback((origin) => {
        if (!(origin instanceof Entity) || !origin.isPlayer()) return;

        origin.setChatSize(!origin.getChatSize()).then((result) => {
            if (result.success) {
                origin.info(`§eChat size set to §f${origin.getChatSize() ? "large" : "small"}§e.`);
            } else {
                origin.error(result.reason ?? "Failed to change chat size.");
            }
        })
    })
).register("Rank")