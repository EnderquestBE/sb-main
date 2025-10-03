import { StringEnum } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";
import { ChatHandler } from "../../Handlers";
new CommandBuilder("broadcast", "Broadcasts a message all players.")
    .setPermissions(["mod.broadcast"])
    .addOverload(new CommandOverload({
        message: StringEnum
    }).onCallback((origin, { message: messageRaw }) => {
        if (!messageRaw) return;
        const message = messageRaw.result as string;
        ChatHandler.broadcast(message, origin.world.serenity)
    }))
    .register("Moderation");