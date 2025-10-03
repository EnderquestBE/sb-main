import { Color } from "../../Types/types"

type ServerTip = {
    message: string,
    color: Color
}

const Tips: ServerTip[] = [
    { message: "§aYou can teleport to island locations with §e/is homes§a!", color: Color.Green },
    { message: "§bCustom enchantments can take your gear to the next level!", color: Color.Aqua },
    { message: "§cUse §b/sh §cand §b/shxp§c to sell your items!", color: Color.Red },
    { message: "§eCommands can be written on signs to re-use them!", color: Color.Yellow },
    { message: "§aRecruit players to your island with §e/is invite§a!", color: Color.Green },
    { message: "§bCustomize your settings with §d/pref§b!", color: Color.Aqua },
    { message: "§cUse scrolls to upgrade your enchantments!", color: Color.Red },
    { message: "§eUpgrade your island with §d/is expand§d!", color: Color.Yellow },
]

export { Tips }