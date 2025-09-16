import { Logger, LoggerColors } from "@serenityjs/logger";
import { CollectionManager } from "../CollectionManager";
import { DatabaseService } from "../DatabaseService";
import { VendorData } from "../../../Types/types";

class VendorDatabase extends CollectionManager<VendorData> {
    public readonly logger = new Logger("VendorDB", LoggerColors.Green);

    public static instance: VendorDatabase;

    constructor(dbs: DatabaseService) {
        super(dbs.vendors, 'xuid');
        VendorDatabase.instance = this;
    }
}

export { VendorDatabase };