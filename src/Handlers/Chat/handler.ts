import { Player, PlayerChatSignal, Serenity } from "@serenityjs/core";
import { Filter, Island } from "../../Classes/classes";

class ChatHandler {

    public static onChat({ player, message }: PlayerChatSignal, serenity: Serenity) {
        const recipients = serenity.getPlayers()
        for (const recipient of recipients) {
            const island = player.getIsland()
            recipient.sendMessage(this.format(player, island, Filter.censor(message)))
        }
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
        return `§f➙ ${island ? `§7~§f${island.getLevel()}§7~ §f** §5${island.getName()} ` : ""}§7[${player.getRank().displayName}§7] §a${player.username} §7» §f${message}`
    }
}

export { ChatHandler }