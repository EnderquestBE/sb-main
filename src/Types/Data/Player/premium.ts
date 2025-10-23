import { PlayerRank } from "../../../Configuration/Ranks/ranks";

export interface PremiumData {
    xuid: string;
    /**
     * List of rank IDs that a player owns.
     */
    ranks: (keyof typeof PlayerRank)[]
    /**
 * The ranks the player is currently using.
 */
    activeRanks: (keyof typeof PlayerRank)[]
    /**
    * List of vanity item IDs the player owns.
    */
    vanity: string[];
}