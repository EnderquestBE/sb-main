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
     * Fetches player data using username.
     */
    public async getByUsername(username: string): Promise<PremiumData | null> {
        const query = { username: username };
        const player = await this.collection.findOne(query as Filter<PremiumData>) as PremiumData | null;
        return player;
    }
}

export { PremiumDatabase };