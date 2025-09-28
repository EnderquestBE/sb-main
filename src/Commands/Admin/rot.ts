import { Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";

new CommandBuilder("rot", "Logs player rotation.")
    .setPermissions(["serenity.operator"])
    .addOverload(
        new CommandOverload({}).onCallback((origin) => {
            if (!(origin instanceof Player)) return;
            origin.info(`§aYaw: §f${origin.rotation.yaw.toFixed(2)}§a, Pitch: §f${origin.rotation.pitch.toFixed(2)}§a, HeadYaw: §f${origin.rotation.headYaw.toFixed(2)}`);
        }))
    .register("Admin");