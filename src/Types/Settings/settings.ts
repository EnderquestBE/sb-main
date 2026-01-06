import { Player } from "@serenityjs/core"

interface UserSetting {
    name: string // The display name to show for the string.
    description: string // The description of the setting.
    options?: string[] // If set, used as the available options. Otherwise uses toggle.
    function?: (player: Player, newValue: string | boolean) => void // The function to run when the setting is changed.
}

export { UserSetting }