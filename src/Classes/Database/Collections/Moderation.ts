import { ModerationData } from "../../../Types/types";
import { ModerationManager } from "../../Data/Moderation";
import { CollectionManager } from "../CollectionManager";
import { DatabaseService } from "../DatabaseService";

/**
 * Manages database for moderation.
 */
export class ModerationDatabase extends CollectionManager<ModerationData> {

    public static instance: ModerationDatabase;

    constructor(dbs: DatabaseService) {
        super(dbs.moderation, "moderation");
        ModerationDatabase.instance = this;
        ModerationManager.initialize();
    }
}

export { ModerationData }