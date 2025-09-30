import { Player } from "@serenityjs/core";

enum DeviceName {
    Undefined = 0,
    Android = 1,
    iOS = 2,
    MacOS = 3,
    FireOS = 4,
    GearVR = 5,
    Hololens = 6,
    Windows = 7,
    Win32 = 8,
    Dedicated = 9,
    TVOS = 10,
    Orbis = 11,
    "Nintendo Switch" = 12,
    Xbox = 13,
    WindowsPhone = 14,
    Linux = 15
}

class NametagHandler {
    public static format(player: Player) {
        player.nameTag = (`§f<§l§d< §7[${player.getPrimaryRank().displayName}§7] §e${player.username} §d>§r§f>\n§c${DeviceName[player.clientSystemInfo.os]}`)
    }
}

export { NametagHandler }