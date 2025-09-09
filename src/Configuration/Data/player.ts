import { PlayerData } from "../../Types/types";
import { PERMISSION_INTEGER } from "../Permissions/player";
import { PlayerRank } from "../Ranks/ranks";


const DEFAULT_PLAYER_DATA: PlayerData = {
    xuid: "",
    username: "",
    permission: PERMISSION_INTEGER.MEMBER,
    balance: {
        money: 100, // Starting money
        xp: 0
    },
    ranks: [PlayerRank.GUEST],
    rank: PlayerRank.GUEST,
    chatColor: "white",
    island: "",
    settings: {
        hudMode: "scoreboard"
    },
    timePlayed: 0,
    lastSeen: new Date(),
    lastUpdated: new Date(),
};

export { DEFAULT_PLAYER_DATA }