import { Player, StringEnum } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";
import { MorphManager } from "../../Classes/Morph";

new CommandBuilder("morph", "Changes the player's skin data.")
    .setPermissions(["serenity.operator"])
    .addOverload(
        new CommandOverload({
            morphId: StringEnum
        }).onCallback((origin, { morphId }) => {
            if (!(origin instanceof Player)) return;
            const player = origin;
            const morph = morphId.result;
            if (!morph) {
                player.error("You must specify a morph ID.");
                return;
            }

            // Attempt morph.
            MorphManager.morph(player, morph)
        }))
    .register("Admin");