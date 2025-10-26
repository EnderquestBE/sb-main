import { Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload, PremiumDatabase } from "../../Classes";
import { LinkManager } from "../../Discord";

new CommandBuilder("link", "Generates a code to link your discord account.")
    .addOverload(
        new CommandOverload({}).onCallback((player) => {
            if (!(player instanceof Player)) return;

            const premiumDB = PremiumDatabase.instance;
            premiumDB.getByXUID(player.xuid).then((premiumData) => {
                if (!premiumData) {
                    return player.error("You do not currently have an account on Enderquest.");
                }

                if (premiumData.discordId && premiumData.discordId !== "") {
                    return player.error("Your Minecraft account is already linked to a Discord account.");
                }

                if (LinkManager.hasCode(player.xuid)) {
                    return player.error("Your account already has a pending link code.")
                }

                const code = LinkManager.generateCode(player.xuid);
                player.info(`§bYour link code is: §c${code}\n§3Use §a/link <code> §3in our Discord server to link your account. §7This code will expire in 2 minutes.`);
            });
        })
    )
    .register("General");