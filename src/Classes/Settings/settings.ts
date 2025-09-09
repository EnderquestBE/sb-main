import { ModalForm, Player } from "@serenityjs/core";
import { Setting, USERSETTINGS } from "../../Configuration/Settings/settings";
import { Logger, LoggerColors } from "@serenityjs/logger";

class Settings {
    private static readonly logger = new Logger("Settings", LoggerColors.Aqua)

    public static show(player: Player) {
        const form = new ModalForm("Settings")
        for (const setting of Object.entries(player.getSettings()) as [keyof typeof Setting, string | boolean][]) {
            const info = USERSETTINGS.get(setting[0])
            if (!info) continue
            if (info.options) {
                form.dropdown(info.name, info.options, info.options.indexOf(setting[1] as string))
            } else {
                form.toggle(info.name, setting[1] as boolean)
            }
            form.show(player).then((result) => {
                if (!result) return
                if (result instanceof Error) {
                    player.error("Something went wrong changing your settings.")
                    this.logger.error(`Failed to set settings for ${player.username}: ${result.message}`)
                    return
                }
                for (const option of (result as (number | boolean)[])) {
                    let value: string | boolean
                    if (typeof option === "number") {
                        value = info.options![option]!
                    } else {
                        value = option
                    }
                    player.setSetting(setting[0], value)
                    if (info.function) {
                        info.function(player, value)
                    }
                }
                player.info("§aYour settings have been changed.")
            })
        }
    }
}

export { Settings }