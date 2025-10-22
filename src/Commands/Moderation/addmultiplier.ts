import { IntegerEnum, Player, StringEnum } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";
import { Utils } from "../../Utils";
import { Server } from "../../server";

new CommandBuilder("addmultiplier", "Creates a new global multiplier.")
    .setPermissions(["mod.addmultiplier"])
    .addOverload(new CommandOverload({
        id: StringEnum,
        name: StringEnum,
        factor: IntegerEnum,
        duration: StringEnum
    }).onCallback((player, { id: idRaw, name: nameRaw, factor: factorRaw, duration: durationRaw }) => {
        if (!(player instanceof Player)) return;
        const id = idRaw.result as string;
        const name = nameRaw.result as string;
        const factor = factorRaw.result as number;
        // Parse duration string (e.g., "1h", "30m", "2d", "1d3h or 1d 3h")
        const durationStr = durationRaw.result as string;
        const duration = Utils.parseDuration(durationStr);
        if (duration === null) {
            return player.error("Invalid duration format. Examples: '1h', '30m', '2d', or '1d12h'.");
        }
        if (isNaN(factor) || factor <= 0) {
            return player.error("Factor must be greater than 0.");
        }
        const endsAt = Date.now() + (duration * 1000);
        Server.addMultiplier({
            id,
            name,
            factor,
            endsAt
        });
        player.info(`§bAdded new global multiplier: §e${name} §dx${factor.toFixed(factor % 1 === 0 ? 1 : 2)} §afor §6${Utils.formatDuration(duration)}§a.`);
    }))
    .register("Moderation");