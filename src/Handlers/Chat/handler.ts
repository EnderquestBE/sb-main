import { Player, PlayerChatSignal, Serenity } from "@serenityjs/core";
import { Filter, Island } from "../../Classes/classes";

class ChatHandler {
    private static readonly lastConversationMap = new Map<string, string>();

    private static readonly lastChatMap = new Map<string, number>();

    public static privateMessage(sender: Player, recipient: Player, message: string): void {
        recipient.sendMessage(`§f➙ §e[${sender.username} -> you]§f ${message}`);
        sender.sendMessage(`§f➙ §e[you -> ${recipient.username}]§f ${message}`);

        this.lastConversationMap.set(recipient.xuid, sender.xuid);
        this.lastConversationMap.set(sender.xuid, recipient.xuid);
    }

    public static getLastMessaged(xuid: string): string | undefined {
        return this.lastConversationMap.get(xuid);
    }

    public static onChat({ player, message }: PlayerChatSignal, serenity: Serenity) {
        const lastChat = this.lastChatMap.get(player.xuid) ?? 0
        if (Date.now() - lastChat < 750) {
            player.error("Slow down!");
            this.lastChatMap.set(player.xuid, Date.now())
            return false
        }
        const recipients = serenity.getPlayers()
        for (const recipient of recipients) {
            const island = player.getIsland()
            recipient.sendMessage(this.format(player, island, Filter.censor(message)))
        }
        this.lastChatMap.set(player.xuid, Date.now())
        return false
    }

    public static onJoin(player: Player, serenity: Serenity) {
        const recipients = serenity.getPlayers()
        for (const recipient of recipients) {
            recipient.sendMessage(`§f➙ §f[§a+§f] §a${player.username} §ejoined the server!`)
        }
    }

    public static onLeave(player: Player, serenity: Serenity) {
        const recipients = serenity.getPlayers()
        for (const recipient of recipients) {
            recipient.sendMessage(`§f➙ §f[§c-§f] §a${player.username} §cleft the server!`)
        }
    }

    private static format(player: Player, island: Island | null, message: string) {
        return `§f➙ ${island ? `§7~§f${island.getLevel()}§7~ §f*${island.getData().owner.xuid === player.xuid ? "*" : ""} §5${island.getName()} ` : ""}§7[${player.getRank().displayName}§7] §a${player.username} §7» §f${message}`
    }
}

export { ChatHandler }