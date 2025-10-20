import { Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes"
import { AbilityIndex, Gamemode } from "@serenityjs/protocol";
import { ServerTaskHandler } from "../../Handlers";

new CommandBuilder("fly", "Toggles flight on islands.").setPermissions(["rank.fly"]).addOverload(
    new CommandOverload({
    }).onCallback((player) => {
        if (!(player instanceof Player)) return;

        if (!player.isWorldIsland()) {
            player.error("You can only activate flight on islands.");
            return;
        }

        const canFly = !player.abilities.getAbility(AbilityIndex.MayFly)
        player.abilities.setAbility(AbilityIndex.MayFly, canFly);

        if (!canFly) {
            player.setGamemode(Gamemode.Adventure);
            ServerTaskHandler.queueTask(() => {
                player.setGamemode(Gamemode.Survival);
            }, 1);
        }

        player.info(`§eFlight §f>> ${canFly ? "§aON" : "§cOFF"}`)
    })
).register("Rank")