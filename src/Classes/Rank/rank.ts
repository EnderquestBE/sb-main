import { PlayerRank, RANKS } from "../../Configuration/config";

class Rank {
    public static get(id: keyof typeof PlayerRank) {
        return RANKS.get(id)
    }
}

export { Rank }