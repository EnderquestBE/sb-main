import { ActionForm, Player } from "@serenityjs/core";
import { Setting, USERSETTINGS } from "../../Configuration/Settings/settings";
import { Logger, LoggerColors } from "@serenityjs/logger";
import { ServerTaskHandler } from "../../Handlers";

class Settings {
    private static readonly logger = new Logger("Settings", LoggerColors.Aqua)

    public static async show(player: Player) {
        try {
            const form = new ActionForm("Settings", "Select an option to toggle.");
            const current = player.getSettings();
            const keys: (keyof typeof Setting)[] = [];

            for (const [key, info] of USERSETTINGS.entries()) {
                const currentValue = current[key];
                keys.push(key);
                if (info.options) {
                    const currentIndex = info.options.indexOf(currentValue as string);
                    form.button(`§d${info.name}: §6${info.options[currentIndex] ?? info.options[0]}\n§8${info.description}`);
                } else {
                    form.button(`§d${info.name}: ${(currentValue as boolean) ? "§aEnabled" : "§cDisabled"}\n§8${info.description}`);
                }
            }

            await form.show(player).then((selection) => {
                if (selection instanceof Error) return;
                const selected = keys[selection];
                if (!selected) return;

                let finalValue: string | boolean;
                const info = USERSETTINGS.get(selected)!;

                if (info.options) {
                    // Set final value to next option in list.
                    const currentIndex = info.options.indexOf(player.getSetting(selected) as string);
                    const nextIndex = (currentIndex + 1) % info.options.length;
                    finalValue = info.options[nextIndex]!;
                } else {
                    finalValue = !(player.getSetting(selected) as boolean);
                }

                player.setSetting(selected, finalValue);
                info.function?.(player, finalValue);

                ServerTaskHandler.queueTask(() => {
                    Settings.show(player);
                }, 50);
            })

        } catch (error) {
            player.error("Unable to change settings.");
            this.logger.error(`Failed to set settings for ${player.username}:`, error);
        }
    }
}

export { Settings }