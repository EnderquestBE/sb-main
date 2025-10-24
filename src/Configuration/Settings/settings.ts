import { Scorebar } from "../../Handlers"
import { UserSetting } from "../../Types/types"

enum Setting {
    hudMode = "hudMode",
    showXpOverlay = "showXpOverlay",
    blockPartyRequests = "blockPartyRequests",
}


const USERSETTINGS = new Map<keyof typeof Setting, UserSetting>([
    [
        Setting.hudMode,
        {
            name: "Hud",
            options: ["scoreboard", "tooltip", "off"],
            function(player, newValue) {
                if (newValue !== "scoreboard") {
                    Scorebar.clear(player)
                }
            }
        }
    ],
    [
        Setting.showXpOverlay,
        {
            name: "Show XP Overlay"
        }
    ],
    [
        Setting.blockPartyRequests,
        {
            name: "Block Party Requests"
        }
    ]
])

export { USERSETTINGS, Setting }