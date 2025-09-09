import { CommandBuilder, CommandOverload, Settings } from "../../Classes/classes"

new CommandBuilder("settings", "Change your settings.").setAliases(["pref"]).addOverload(
    new CommandOverload({
    }).onCallback((origin) => {
        //@ts-ignore
        const player = origin as Player
        Settings.show(player)
    })
).register("General")