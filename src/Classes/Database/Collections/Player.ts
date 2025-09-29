import { Logger, LoggerColors } from "@serenityjs/logger";
import { CollectionManager } from "../CollectionManager";
import { DatabaseService } from "../DatabaseService";
import { PlayerData } from "../../../Types/types";
import { Filter } from "mongodb";

/**
 * Manages database for players.
 */
class PlayerDatabase extends CollectionManager<PlayerData> {
    public readonly logger = new Logger("PlayerDB", LoggerColors.Green)

    public static instance: PlayerDatabase;

    constructor(dbs: DatabaseService) {
        super(dbs.players, 'xuid');
        PlayerDatabase.instance = this;
    }

    /**
     * Fetches player data using username.
     */
    public async getByUsername(username: string): Promise<PlayerData | null> {
        const query = { username: username };
        const player = await this.collection.findOne(query as Filter<PlayerData>) as PlayerData | null;
        return player;
    }
}

export { PlayerDatabase }