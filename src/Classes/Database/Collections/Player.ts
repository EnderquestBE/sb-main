import { Logger, LoggerColors } from "@serenityjs/logger";
import { PlayerData } from "../../../Types/Database/Collections/player";
import { CollectionManager } from "../CollectionManager";
import { DatabaseService } from "../DatabaseService";

/**
 * Manages database for players.
 */
class PlayerDatabase extends CollectionManager<PlayerData> {
    public readonly logger = new Logger("PlayerDB", LoggerColors.Green)

    constructor(dbs: DatabaseService) {
        super(dbs.players, 'xuid');
    }
}



export { PlayerDatabase }