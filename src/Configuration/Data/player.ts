import { PlayerData } from "../../Types/types";
import { PERMISSION_INTEGER } from "../config";

const DEFAULT_PLAYER_DATA: PlayerData = {
    xuid: "",
    username: "",
    permission: PERMISSION_INTEGER.MEMBER,
    balance: {
        money: 100, // Starting money
        xp: 0
    },
    ranks: [],
    rank: "guest",
    chatColor: "white",
    island: "",
    settings: {
        hudMode: "sidebar"
    },
    timePlayed: 0,
    lastSeen: new Date(),
    lastUpdated: new Date(),
};

export { DEFAULT_PLAYER_DATA }