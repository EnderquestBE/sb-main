import { CustomEnum, Entity, MessageForm } from "@serenityjs/core";
import { CommandOverload, Island } from "../../Classes";
import { Utils } from "../../Utils/utils";

enum TransactionTypeColor {
    withdraw = "§c",
    deposit = "§a",
    income = "§e"
}

class IslandBankEnum extends CustomEnum {
    public static readonly identifier = "islandBank";
    public static options = ["bank"];
}

class IslandBankLogsEnum extends CustomEnum {
    public static readonly identifier = "islandBankLogs";
    public static options = ["logs"];
}

const IslandBankCommand = new CommandOverload({
    bank: IslandBankEnum,
    logs: [IslandBankLogsEnum, true]
}).onCallback((origin, { logs }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;
    //@ts-ignore
    const showLogs: string | null = logs.result

    const island = player.getIsland()
    if (!island)
        return player.error(
            `You don't have an island! Use /is create <name> to create one.`
        );

    try {
        if (showLogs) {
            const form = new MessageForm("Bank Logs");
            const logs = island.getBankLogs()
            if (logs.length == 0) form.content = "No history was found.\n§cMake a deposit with §e/is §6deposit §c<amount>§f"
            else {
                for (const log of logs) {
                    form.content += `\n§f[${log.timestamp.toLocaleDateString(undefined, { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).replace(",", "")}] ${TransactionTypeColor[log.action]}${log.action === "withdraw" ? "-" : "+"}$${Utils.formatInt(log.amount)} §7${log.message}`
                }
                form.content = form.content.slice(1)
            }
            form.show(player)
        } else {
            player.info(`§eIsland Balance: §6$${Utils.formatInt(island.getBankBalance())}§8/§c$${Utils.formatInt(island.getLimit("bank").max)}`)
        }
    } catch (e) {
        Island.logger.warn(
            "Error showing bank information for " + player.username + ": " + e
        );
    }
});

export { IslandBankCommand };
