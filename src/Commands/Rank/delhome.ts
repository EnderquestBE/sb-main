import { Player, StringEnum } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";

new CommandBuilder("delhome", "Removes a home location.")
    .setAliases(["rmhome"])
    .setPermissions(["rank.home"])
    .addOverload(
        new CommandOverload({
            name: StringEnum
        }).onCallback((player, { name: nameRaw }) => {
            if (!(player instanceof Player)) return

            const name = nameRaw.result!;

            if (!player.hasHome(name)) {
                return player.error("You don't have an existing home with that name.");
            }

            player.removeHome(name).then(result => {
                if (!result.success) return player.error("Failed to remove home:" + result.reason!);
                player.info(`§cHome §e${name} §chas been deleted.`);
            })
        })
    )
    .register("Rank");