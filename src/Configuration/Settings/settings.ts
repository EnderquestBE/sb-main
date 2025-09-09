import { UserSetting } from "../../Types/types"

enum Setting {
    hudMode = "hudMode"
}


const USERSETTINGS = new Map<string, UserSetting>([
    [
        Setting.hudMode,
        {
            name: "Hud",
            options: ["sidebar", "actionbar", "off"],
        }
    ]
])

export { USERSETTINGS, Setting }