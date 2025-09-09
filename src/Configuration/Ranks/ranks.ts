import { RankInfo } from "../../Types/types"

enum PlayerRank {
    GUEST = "GUEST"
}


const RANKS = new Map<keyof typeof PlayerRank, RankInfo>([
    [
        PlayerRank.GUEST,
        {
            id: PlayerRank.GUEST,
            name: "Guest",
            displayName: "§fGuest",
            color: "White",
            permissions: []
        }
    ]
])

export { RANKS, PlayerRank }