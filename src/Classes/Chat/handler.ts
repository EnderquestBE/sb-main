import { Player, PlayerChatSignal } from "@serenityjs/core";
import { Filter, Island } from "../classes";

class ChatHandler {

    public static onChat({ world, player, message }: PlayerChatSignal) {
        const worlds = world.serenity.getWorlds()
        for (let world of worlds) {
            if (world.getPlayers().length > 0) {
                player.getIsland().then((island) => {
                    world.sendMessage(this.format(player, island, Filter.censor(message)))
                })
            }
        }
        return false
    }

    private static format(player: Player, island: Island | null, message: string) {
        return island ? `§f➙ §7~§f${island.getLevel()}§7~ §f** §5${island.getName()} §7[§fGuest§7] §a${player.username} §7» §f${message}` : ""
    }
}

export { ChatHandler }