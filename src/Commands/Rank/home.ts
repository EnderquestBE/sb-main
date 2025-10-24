import { Player, StringEnum } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";
import { Vector3f } from "@serenityjs/protocol";

new CommandBuilder("home", "Teleports you to a set home location.")
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

            const home = player.getHomes().find(home => home.name === name)!;

            if (!home) {
                return player.error("Home not found.");
            }

            const world = player.world.serenity.getWorld(home.world);
            if (!world) {
                if (home.world.startsWith("sb_")) {
                    return player.error("Island is offline or does not exist.");
                } else {
                    return player.error("That world is not currently accessible.");
                }
            }

            const dimension = world.getDimension();
            const { x, y, z } = home.location;
            player.teleport(new Vector3f(x, y, z), dimension);
            player.info(`§eYou have been teleported to home §d${name}§e${home.world.startsWith("sb_") ? `§e on §a${home.world.substring(3)}§e.` : "."}`);
        })
    )
    .register("Rank");