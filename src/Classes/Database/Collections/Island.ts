import { Logger, LoggerColors } from "@serenityjs/logger";
import { IslandData, IslandRole } from "../../../Types/types";
import { CollectionManager } from "../CollectionManager";
import { DatabaseService } from "../DatabaseService";
import { UpdateResult } from "mongodb";

/**
 * Manages database for islands.
 */
class IslandDatabase extends CollectionManager<IslandData> {
  public readonly logger = new Logger("IslandDB", LoggerColors.Green)

  public static instance: IslandDatabase;

  constructor(dbs: DatabaseService) {
    super(dbs.islands, 'name');
    IslandDatabase.instance = this;
  }

}

export { IslandDatabase }