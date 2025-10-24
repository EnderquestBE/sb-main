import { ActionForm, CustomEnum, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";
import { Vector3f } from "@serenityjs/protocol";

class HomesListEnum extends CustomEnum {
    public static readonly identifier = "homesList";
    public static options = ["list"];
}

new CommandBuilder("homes", "Manage and teleport to your home locations.")
    .setPermissions(["rank.home"])
    .addOverload(
        new CommandOverload({
            list: [HomesListEnum, true]
        }).onCallback((player, { list }) => {
            if (!(player instanceof Player)) return

            //@ts-ignore
            if (list?.result) {
                player.info(`§6Homes: ${player.getHomes().map(h => `§d${h.name}`).join("§6, ") || "§7No homes set."}`)
            } else {
                const homes = player.getHomes();
                if (homes.length === 0) {
                    return player.info("§6You do not have any homes set. Use §e/sethome <name> §6to create one.");
                }

                const form = new ActionForm("Homes", "Select a home to teleport to.");

                for (const home of homes) {
                    form.button(`§5${home.name}`);
                }

                form.show(player, (result, error) => {
                    if (error || result === null) return;
                    const selectedHome = homes[result];

                    if (!selectedHome) {
                        return player.error("Home not found.");
                    }

                    const world = player.world.serenity.getWorld(selectedHome.world);
                    if (!world) {
                        if (selectedHome.world.startsWith("sb_")) {
                            return player.error("Island is offline or does not exist.");
                        } else {
                            return player.error("That world is not currently accessible.");
                        }
                    }

                    const dimension = world.getDimension();
                    const { x, y, z } = selectedHome.location;
                    player.teleport(new Vector3f(x, y, z), dimension);
                    player.info(`§eYou have been teleported to home §d${selectedHome.name}§e${selectedHome.world.startsWith("sb_") ? `§e on §a${selectedHome.world.substring(3)}§e.` : "."}`);
                });
            }
        })
    )
    .register("Rank");