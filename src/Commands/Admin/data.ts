import { Player } from "@serenityjs/core"
import { CommandBuilder, CommandOverload } from "../../Classes/classes"
import { PlayerExtension } from "../../extensions/player"

new CommandBuilder("data", "Data-related admin commands.").setPermissions(["serenity.operator"]).addOverload(
    new CommandOverload({
    }).onCallback((origin) => {
        //@ts-ignore
        const player = origin as Player
        PlayerExtension.createSession(player)
        return {
            message: "Successfully reset player data."
        }
    })
).register("Admin")