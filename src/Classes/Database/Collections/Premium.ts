import { Filter } from "mongodb";
import { PremiumData } from "../../../Types/types";
import { CollectionManager } from "../CollectionManager";
import { DatabaseService } from "../DatabaseService";

/**
 * Manages premium player data.
 */
class PremiumDatabase extends CollectionManager<PremiumData> {
    public static instance: PremiumDatabase;

    constructor(dbs: DatabaseService) {
        super(dbs.premium, 'xuid');
        PremiumDatabase.instance = this;
    }

    /**
     * Fetches player data using XUID.
     */
    public async getByXUID(xuid: string): Promise<PremiumData | null> {
        const query = { xuid: xuid };
        const player = await this.collection.findOne(query as Filter<PremiumData>) as PremiumData | null;
        return player;
    }

    public async getByDiscordId(discordId: string): Promise<PremiumData | null> {
        const query = { discordId: discordId };
        const player = await this.collection.findOne(query as Filter<PremiumData>) as PremiumData | null;
        return player;
    }
}

export { PremiumDatabase };