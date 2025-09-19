import { StringEnum, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes/classes";
import { PlayerEnum } from "../../Classes/Command/Enums/player";
import { Server } from "../../server";
import { ChatHandler } from "../../Handlers/Chat/handler"; // Updated import

new CommandBuilder("message", "Sends a private message to a player.")
    .setAliases(["msg", "whisper", "w"])
    .addOverload(
        new CommandOverload({
            player: PlayerEnum,
            message: StringEnum
        }).onCallback((origin, { player, message }) => {
            if (!(origin instanceof Player)) return;

            const target = Server.instance.getPlayerByUsername(player.result as string);
            if (!target) {
                return origin.error("Player is offline or does not exist.");
            }

            if (target.xuid === origin.xuid) {
                return origin.error("You cannot message yourself.");
            }

            ChatHandler.privateMessage(origin, target, message.result!);
        })
    )
    .register("General");