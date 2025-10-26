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
    /**
     * Slots used for limiting certain premium behaviors.
     */
    slots: {
        /* How many homes a player can have at once. */
        homes: number;
        /* How many auctions a player can have listed at once. */
        auction: number;
        /* How many islands a player can be a member of. */
        membership: number;
    }
    /**
     * Linked discord ID.
     */
    discordId: string;
}