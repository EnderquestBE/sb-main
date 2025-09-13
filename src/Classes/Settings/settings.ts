import { ModalForm, Player } from "@serenityjs/core";
import { Setting, USERSETTINGS } from "../../Configuration/Settings/settings";
import { Logger, LoggerColors } from "@serenityjs/logger";

class Settings {
    private static readonly logger = new Logger("Settings", LoggerColors.Aqua)

    public static async show(player: Player) {
        try {
            const form = new ModalForm("Settings");
            const current = player.getSettings();
            const keys: (keyof typeof Setting)[] = [];

            for (const [key, info] of USERSETTINGS.entries()) {
                const currentValue = current[key];
                keys.push(key);
                if (info.options) {
                    const currentIndex = info.options.indexOf(currentValue as string);
                    form.dropdown(info.name, info.options, currentIndex > -1 ? currentIndex : 0);
                } else {
                    form.toggle(info.name, currentValue as boolean);
                }
            }

            const result = await form.show(player).then((result) => {
                if (!result) return player.info("§cYour settings changes have been canceled.")
                const options = result as (number | boolean)[]
                for (let i = 0; i < options.length; i++) {
                    const option = options[i]
                    const key = keys[i]
                    if (!key) return;

                    const info = USERSETTINGS.get(key)!;
                    let finalValue: string | boolean;

                    if (typeof option === "number" && info.options) {
                        finalValue = info.options[option]!
                    } else {
                        finalValue = option as boolean
                    }

                    player.setSetting(key, finalValue);
                    info.function?.(player, finalValue);
                }
            })
            player.info("§aYour settings have been updated!");

        } catch (error) {
            player.error("Unable to change settings.");
            this.logger.error(`Failed to set settings for ${player.username}:`, error);
        }
    }
}

export { Settings }