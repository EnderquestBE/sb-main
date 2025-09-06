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
    super(dbs.islands, 'uuid');
    IslandDatabase.instance = this;
  }


  /**
   * Specific method to update the island role in the database.
   * @param uuid UUID of the island.
   * @param xuid XUID of the user.
   * @param role Role to change.
   */

  public async updateMemberRole(uuid: string, xuid: string, role: IslandRole): Promise<UpdateResult> {
    const filter = { uuid: uuid };
    const updateDoc = { $set: { "members.$[elem].role": role } };
    const options = { arrayFilters: [{ "elem.xuid": xuid }] };
    return this.collection.updateOne(filter, updateDoc, options);
  }

}

export { IslandDatabase }