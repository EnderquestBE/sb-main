import { Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload, PlayerEnum } from "../../Classes";

new CommandBuilder("cooldown", "Toggles command cooldown for a player.")
    .setPermissions(["mod.cooldown"])
    .addOverload(new CommandOverload({
        player: PlayerEnum
    }).onCallback((player, { player: targetRaw }) => {
        if (!(player instanceof Player)) return;
        const targetName = targetRaw.result as string;
        if (!targetName) return;
        const target = player.world.serenity.getPlayerByUsername(targetName);
        if (!target) {
            player.error("Player is offline or does not exist.");
            return;
        }

        //@ts-ignore
        target._commandCooldown = !target._commandCooldown || false;
        //@ts-ignore
        player.info(`§a${target.username} §bhas been ${target._commandCooldown ? "§aexempted §bfrom" : "§cre-added §bto"} command cooldown${target._commandCooldown ? "" : " until next restart"}.`)
        //@ts-ignore
        target.info(`§bYou have been ${target._commandCooldown ? "§aexempted §bfrom" : "§cre-added §bto"} command cooldown${target._commandCooldown ? "" : " until next restart"}.`)
    }))
    .register("Moderation");