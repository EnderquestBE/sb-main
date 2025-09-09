import { Logger, LoggerColors } from "@serenityjs/logger";
import { CollectionManager } from "../CollectionManager";
import { DatabaseService } from "../DatabaseService";
import { PlayerData } from "../../../Types/types";

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
}



export { PlayerDatabase }