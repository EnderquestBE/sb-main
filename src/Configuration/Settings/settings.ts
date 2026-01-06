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
            name: "HUD Mode",
            description: "Changes your HUD style.",
            options: ["SCOREBOARD", "TOOLTIP", "OFF"],
            function(player, newValue) {
                if (newValue !== "SCOREBOARD") {
                    Scorebar.clear(player)
                }
            }
        }
    ],
    [
        Setting.showXpOverlay,
        {
            name: "XP Overlay",
            description: "Toggles the XP gain overlay."
        }
    ],
    [
        Setting.blockPartyRequests,
        {
            name: "Block Party Requests",
            description: "Blocks party requests from players."
        }
    ]
])

export { USERSETTINGS, Setting }