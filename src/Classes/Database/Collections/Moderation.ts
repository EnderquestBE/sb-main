import { GlobalServerData } from "../../../Types/types";
import { GlobalDataManager } from "../..";
import { CollectionManager } from "../CollectionManager";
import { DatabaseService } from "../DatabaseService";

/**
 * Manages database for global server data, such as moderation.
 */
class GlobalDatabase extends CollectionManager<GlobalServerData> {

    public static instance: GlobalDatabase;

    constructor(dbs: DatabaseService) {
        super(dbs.global, "global");
        GlobalDatabase.instance = this;
        GlobalDataManager.initialize();
    }
}

export { GlobalDatabase };