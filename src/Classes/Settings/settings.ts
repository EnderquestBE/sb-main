import { ModalForm, Player } from "@serenityjs/core";
import { USERSETTINGS } from "../../Configuration/Settings/settings";
import { Logger, LoggerColors } from "@serenityjs/logger";

class Settings {
    private static readonly logger = new Logger("Settings", LoggerColors.Aqua)

    public static show(player: Player) {
        const form = new ModalForm("Settings")
        for (const setting of Object.entries(player.getSettings())) {
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
                    if (typeof option === "number") {
                        player.setSetting(setting[0], info.options![option]!)
                    } else {
                        player.setSetting(setting[0], option)
                    }
                }
                player.info("§aYour settings have been changed.")
            })
        }
    }
}

export { Settings }