import { StringEnum, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes/classes";
import { Server } from "../../server";
import { ChatHandler } from "../../Handlers/Chat/handler"; // Updated import

new CommandBuilder("reply", "Replies to the last private message.")
    .setAliases(["r"])
    .addOverload(
        new CommandOverload({
            message: StringEnum
        }).onCallback((origin, { message }) => {
            if (!(origin instanceof Player)) return;

            const targetXuid = ChatHandler.getLastMessaged(origin.xuid);
            if (!targetXuid) {
                return origin.error("You have no one to reply to.");
            }

            const target = Server.instance.getPlayerByXuid(targetXuid);
            if (!target) {
                return origin.error("That player has gone offline.");
            }

            ChatHandler.privateMessage(origin, target, message.result!);
        })
    )
    .register("General");