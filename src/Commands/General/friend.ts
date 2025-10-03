import { Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload, PlayerEnum } from "../../Classes";
import { Server } from "../../server";
import { Utils } from "../../Utils/utils";
import { ShowProfilePacket } from "@serenityjs/protocol";

new CommandBuilder("friend", "Send a friend request to another player.")
    .setAliases(["friend"])
    .addOverload(
        new CommandOverload({
            user: PlayerEnum,
        }).onCallback((origin, { user }) => {
            if (!(origin instanceof Player)) return
            const player = origin
            const recipientName = user.result as string
            if (!recipientName) return
            const recipient = Server.instance.getPlayerByUsername(recipientName)
            if (!recipient) {
                player.error("Player is offline or does not exist.")
                return
            }
            if (recipient.username === player.username) {
                player.error("You cannot friend yourself!")
                return
            }

            const packet = new ShowProfilePacket();
            packet.xuid = recipient.xuid;

            player.send(packet);
        })
    )
    .register("General");