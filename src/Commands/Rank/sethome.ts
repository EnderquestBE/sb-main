import { Player, StringEnum } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";

new CommandBuilder("sethome", "Sets a home location.")
    .setPermissions(["rank.home"])
    .addOverload(
        new CommandOverload({
            name: StringEnum
        }).onCallback((player, { name: nameRaw }) => {
            if (!(player instanceof Player)) return

            if (!player.dimension.getBlock(player.position).below(1).isSolid) {
                return player.error("Home locations must have a solid block under them.")
            }

            if (player.hasHome(nameRaw.result!)) {
                return player.error("You already have a home with that name.");
            }

            if (player.getSlots("homes") <= player.getHomes().length) {
                return player.error("You have reached your home limit.");
            }

            const name = nameRaw.result!;
            const location = player.position.clone()
            location.floor().add({ x: 0.5, y: 3, z: 0.5 })

            player.addHome({ name, location: location, world: player.world.identifier }).then(result => {
                if (!result.success) return player.error("Failed to set home:" + result.reason!);
                player.info(`§bCreated new home §e${name} §bat your position.`);
            })
        })
    )
    .register("Rank");