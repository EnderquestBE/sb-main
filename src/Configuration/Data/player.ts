import { PlayerData, PremiumData } from "../../Types/types";
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
    nameColor: "Green",
    chatColor: "White",
    chatSize: false,
    island: "",
    memberOf: [],
    settings: {
        hudMode: "scoreboard",
        showXpOverlay: true
    },
    timePlayed: 0,
    stats: {
        kills: 0,
        deaths: 0,
        ratio: 0,
        blocksMined: 0,
        blocksPlaced: 0,
        cropsFarmed: 0,
        mobsSlayed: 0,
    },
    equippedVanity: {
        1: null,
        2: null,
        3: null
    },
    lastSeen: new Date(),
    firstSeen: new Date(),
    lastUpdated: new Date(),
};

const DEFAULT_PREMIUM_DATA: PremiumData = {
    xuid: "",
    activeRanks: [PlayerRank.GUEST],
    ranks: [PlayerRank.GUEST],
    vanity: [],
}

export { DEFAULT_PLAYER_DATA, DEFAULT_PREMIUM_DATA }