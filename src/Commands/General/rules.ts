import { Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";
import { SERVER_RULES } from "../../Configuration/config";

const bridgeTop = "=".repeat(19)
const bridgeBottom = "=".repeat(52)

new CommandBuilder("rules", "View the server rules.")
    .setAliases(["rules"])
    .addOverload(
        new CommandOverload({}).onCallback((player) => {
            if (!(player instanceof Player)) return
            player.sendMessage("§e" + bridgeTop + " §c§lServer Rules§r " + "§e" + bridgeTop);
            let i = 1;
            for (const line of SERVER_RULES) {
                player.sendMessage(`§c» §e${i++}. §7${line.match(/.{1,60}(\s|$)/g)?.join("\n§7")}`);
            }
            player.sendMessage("§e" + bridgeBottom)
        })
    )
    .register("General");