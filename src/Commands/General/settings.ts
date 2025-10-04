import { Entity } from "@serenityjs/core";
import { CommandBuilder, CommandOverload, Settings } from "../../Classes"

new CommandBuilder("settings", "Change your settings.").setAliases(["pref", "hud"]).addOverload(
    new CommandOverload({
    }).onCallback((origin) => {
        if (!(origin instanceof Entity) || !origin.isPlayer()) return;
        Settings.show(origin)
    })
).register("General")