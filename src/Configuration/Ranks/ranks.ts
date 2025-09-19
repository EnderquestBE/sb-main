import { RankInfo } from "../../Types/types"

enum PlayerRank {
    GUEST = "GUEST",
    VOTER = "VOTER",
    VIP = "VIP",
    OWNER = "OWNER",
}


const RANKS = new Map<keyof typeof PlayerRank, RankInfo>([
    [
        PlayerRank.GUEST,
        {
            id: PlayerRank.GUEST,
            name: "Guest",
            displayName: "§fGuest",
            color: "White",
            permissions: [],
            kits: []
        }
    ],
    [
        PlayerRank.VOTER,
        {
            id: PlayerRank.VOTER,
            name: "Voter",
            displayName: "§aVoter",
            color: "Green",
            permissions: [],
            kits: []
        }
    ],
    [
        PlayerRank.VIP,
        {
            id: PlayerRank.VIP,
            name: "VIP",
            displayName: "§bVIP",
            color: "Aqua",
            permissions: [],
            kits: []
        }
    ],
    [
        PlayerRank.OWNER,
        {
            id: PlayerRank.OWNER,
            name: "Owner",
            displayName: "§6Owner",
            color: "Yellow",
            permissions: ["enderquest.chatsize"],
            kits: []
        }
    ]
])

export { RANKS, PlayerRank }