import { Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes"
import { Server } from "../../server";
import { Utils } from "../../Utils";

new CommandBuilder("multiplier", "Queries the current global multiplier.").addOverload(
    new CommandOverload({
    }).onCallback((player) => {
        if (!(player instanceof Player)) return;
        const multipliers = Server.getMultipliers();
        const globalMultiplier = Server.globalMultiplier;
        if (globalMultiplier > 1) {
            player.info(`§eThe current multiplier is §dx${globalMultiplier.toFixed(globalMultiplier % 1 === 0 ? 1 : 2)}§e.`);
            player.info("§7Active multipliers:" + multipliers.map(m => {
                const timeLeft = Math.floor((m.endsAt - Date.now()) / 1000);
                return `\n    §d» §e${m.name} §7[§dx${m.factor.toFixed(m.factor % 1 === 0 ? 1 : 2)}§7] §7(§6${Utils.formatDuration(timeLeft)} §cleft§7)`;
            }).join(""));
        } else {
            player.info("§cThere is currently no multiplier active.");
        }
    })
).register("General");