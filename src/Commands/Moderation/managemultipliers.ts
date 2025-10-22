import { ActionForm, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";
import { Utils } from "../../Utils";
import { Server } from "../../server";

function showMultiplierForm(player: Player) {
    const form = new ActionForm("Manage Multipliers");
    form.content = "Select a multiplier to manage.";
    const multipliers = Server.getMultipliers()
    for (const multiplier of multipliers) {
        form.button(multiplier.name);
    }
    form.show(player, (result, error) => {
        if (result === null || error) return;
        const { id, name, factor, endsAt } = multipliers[result]!;
        const form2 = new ActionForm(name);
        form2.content = `Name: ${name}\nFactor: x${factor.toFixed(factor % 1 === 0 ? 1 : 2)}\nEnds At: ${endsAt ? new Date(endsAt).toLocaleString() + ` (${Utils.formatDuration(Math.floor((endsAt - Date.now()) / 1000))} left)` : "Never"}`;
        form2.button("Remove Multiplier");
        form2.button("Back");
        form2.show(player, (result2, error2) => {
            if (result2 === null || error2) return;
            if (result2 === 0) {
                Server.removeMultiplier(id);
                player.info(`§bSuccessfully removed multiplier §e${name}§b.`);
            } else {
                showMultiplierForm(player);
                return;
            }
        });
    });
}

new CommandBuilder("managemultipliers", "Manages global multipliers.")
    .setPermissions(["mod.managemultipliers"])
    .addOverload(new CommandOverload({
    }).onCallback((player) => {
        if (!(player instanceof Player)) return;
        showMultiplierForm(player);
    }))
    .register("Moderation");