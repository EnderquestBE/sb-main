import { CustomEnum, IntegerEnum, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload, PlayerEnum } from "../../Classes";
import { Server } from "../../server";

class IntOperationEnum extends CustomEnum {
    public static readonly identifier = "IntOperationEnum";
    public static options = ["add", "remove", "set"];
}

new CommandBuilder("money", "Manages a player's money.")
    .setPermissions(["serenity.operator"])
    .addOverload(
        new CommandOverload({
            user: PlayerEnum,
            operation: IntOperationEnum,
            amount: IntegerEnum
        }).onCallback((executor, { user, operation: operationResult, amount: amountResult }) => {
            if (!(executor instanceof Player)) return;

            const playerName = user.result as string;
            if (!playerName) return;

            const player = Server.instance.getPlayerByUsername(playerName);
            if (!player) {
                return executor.error("Player is offline or does not exist.");
            }

            const operation = operationResult.result as string;
            const amountValue = amountResult.result as number;

            switch (operation) {
                case "add":
                    player.addMoney(amountValue);
                    executor.info(`§aAdded §6$${amountValue} §ato §e${playerName}'s §abalance.`);
                    break;
                case "remove":
                    player.removeMoney(amountValue);
                    executor.info(`§cRemoved §6$${amountValue} §cfrom §e${playerName}'s §cbalance.`);
                    break;
                case "set":
                    player.setMoney(amountValue);
                    executor.info(`§bSet §e${playerName}'s §bbalance to §6$${amountValue}§b.`);
                    break;
            }
        })
    )
    .register("General");