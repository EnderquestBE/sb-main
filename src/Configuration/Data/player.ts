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
    activeRanks: [PlayerRank.GUEST],
    chatColor: "White",
    chatSize: false,
    island: "",
    settings: {
        hudMode: "scoreboard",
        showXpOverlay: true
    },
    timePlayed: 0,
    lastSeen: new Date(),
    lastUpdated: new Date(),
};

export { DEFAULT_PLAYER_DATA }