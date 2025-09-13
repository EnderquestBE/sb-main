import { IntegerEnum, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes/classes";
import { PlayerEnum } from "../../Classes/Command/Enums/player";
import { Server } from "../../server";
import { Utils } from "../../Utils/utils";

new CommandBuilder("pay", "Sends an amount of your money to another player.")
    .setAliases(["pay"])
    .addOverload(
        new CommandOverload({
            user: PlayerEnum,
            amount: IntegerEnum
        }).onCallback((origin, { user, amount }) => {
            if (!(origin instanceof Player)) return
            const player = origin
            const recipientName = user.result as string
            const value = amount.result
            if (!recipientName || !value) return
            const recipient = Server.instance.getPlayerByUsername(recipientName)
            if (!recipient) {
                player.error("Player is offline or does not exist.")
                return
            }
            if (recipient.username === player.username) {
                player.error("You cannot pay yourself!")
                return
            }
            if (value < 501) {
                player.error("Amount must be over §e$500 §cto send money.")
                return
            }
            if (player.getMoney() < value) {
                player.error("You do not have enough money to send.")
                return
            }
            try {
                player.removeMoney(value)
                recipient.addMoney(value)
                player.info(`§eSent §b$${Utils.formatInt(value)} §eto §a${recipient.username} §esuccessfully! Your Balance: §6$${Utils.formatInt(player.getMoney())}`)
                recipient.info(`§eReceived §6$${Utils.formatInt(value)} §efrom §a${player.username} §esuccessfully! Your Balance: §6$${Utils.formatInt(recipient.getMoney())}`)
            } catch (e) {
                player.error("Something went wrong during transaction.")
                return
            }
        })
    )
    .register("General");