import { Multiplier } from "../types";
import { BanEntry } from "./Entries/ban";
import { ModerationRecordEntry } from "./Entries/record";
import { Whitelist } from "./whitelist";

interface GlobalServerData {
    /** A list of all active bans on the server. */
    activeBans: BanEntry[];
    /** A record of player moderation histories, indexed by xuid. */
    moderationHistory: Record<string, ModerationRecordEntry[]>;
    /** The server's whitelist settings. */
    whitelist: Whitelist;
    /** The server's global multipliers. */
    globalMultipliers: Multiplier[];
}

export { GlobalServerData };