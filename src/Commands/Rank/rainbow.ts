import { Player, PlayerChatSignal, StringEnum } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";
import { ChatHandler } from "../../Handlers";

const RainbowCooldown = new Map<string, number>();

const colors = ['§c', '§6', '§e', '§a', '§b', '§d'];
function rainbowify(message: string): string {
    let rainbowMessage = '';
    for (let i = 0; i < message.length; i++) {
        const color = colors[i % colors.length];
        rainbowMessage += color + message.charAt(i);
    }
    return rainbowMessage;
}

new CommandBuilder("rainbow", "Chat in rainbow!")
    .setPermissions(["rank.rainbow"])
    .addOverload(
        new CommandOverload({
            message: StringEnum,
        }).onCallback((player, { message: messageRaw }) => {
            if (!(player instanceof Player)) return;

            if (RainbowCooldown.has(player.uuid)) {
                const lastUsed = RainbowCooldown.get(player.uuid) || 0;
                const now = Date.now();
                const diff = now - lastUsed;
                if (diff < 60000) {
                    const secondsLeft = Math.ceil((60000 - diff) / 1000);
                    player.error(`§cYou are on cooldown. Please wait §4${secondsLeft} §cseconds.`);
                    return;
                }
            }
            RainbowCooldown.set(player.uuid, Date.now());

            const message = messageRaw.result;
            if (!message) return player.error("Message is required.");

            ChatHandler.onChat({ player, message: rainbowify(message) } as PlayerChatSignal, player.world.serenity)
        })
    )
    .register("Rank");