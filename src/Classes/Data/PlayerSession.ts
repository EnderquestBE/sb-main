import { PERMISSION_INTEGER } from "../../Configuration/config";
import { OperationResult, PlayerData } from "../../Types/types";
import { DataManager } from "./Manager";
import { Island } from "./Island";
import { PlayerDatabase } from "../Database/Collections/Player";


/**
 * @name PlayerSession
 * Class for manipulating a player's session data.
 */
class PlayerSession extends DataManager<PlayerData, PlayerDatabase> {

  private constructor(initialData: PlayerData, dbManager: PlayerDatabase) {
    super(initialData, dbManager);
  }

  /**
   * @tab Database Methods
   */

  /**
   * Loads a player's data from the database.
   * @param xuid The XUID of the player to load.
   * @param playerDB The player database manager instance.
   */
  public static async load(xuid: string, playerDB: PlayerDatabase): Promise<PlayerSession | null> {
    const playerData = await playerDB.get(xuid);
    if (!playerData) return null;
    return new PlayerSession(playerData, playerDB);
  }

  /**
   * Creates a new player in the database with default values.
   * @param xuid The player's XUID.
   * @param username The player's username.
   * @param playerDB The player database manager instance.
   */
  public static async createDefault(
    xuid: string,
    username: string,
    playerDB: PlayerDatabase
  ): Promise<PlayerSession> {
    const now = new Date();
    const initialData: PlayerData = {
      xuid: xuid,
      username: username,
      permission: PERMISSION_INTEGER.MEMBER,
      balance: {
        coins: 100, // Starting coins
        xp: 0,
        shards: 0
      },
      ranks: [],
      rank: "default",
      chatColor: "white",
      island: "",
      settings: {},
      lastSeen: now,
      lastUpdated: now,
    };
    await playerDB.create(initialData);
    return new PlayerSession(initialData, playerDB);
  }

  /**
   * @tab Property Methods
   */
  public getXuid(): string { return this.data.xuid; }
  public getUsername(): string { return this.data.username; }
  public getPermission(): PERMISSION_INTEGER { return this.data.permission; }
  public getCoins(): number { return this.data.balance.coins; }
  public getXp(): number { return this.data.balance.xp; }
  public getShards(): number { return this.data.balance.shards; }
  public getRanks(): string[] { return this.data.ranks; }
  public getRank(): string { return this.data.rank; }
  public getChatColor(): string { return this.data.chatColor }
  public getIslandUUID(): string { return this.data.island; }
  public async getIsland(): Promise<Island | null> { return await Island.load(this.data.island) }
  public getSettings(): { [key: string]: string | boolean } { return this.data.settings; }
  public getLastSeen(): Date { return this.data.lastSeen; }
  public getLastUpdated(): Date { return this.data.lastUpdated; }


  /**
   * @tab Boolean Methods
   */

  /**
   * Checks if the player owns a specific rank.
   * @param rankId The ID of the rank to check.
   */
  public hasRank(rankId: string): boolean {
    return this.data.ranks.includes(rankId);
  }

  /**
   * Checks if the player has a specific setting stored.
   * @param key The key of the setting to check for.
   */
  public hasSetting(key: string): boolean {
    return key in this.data.settings;
  }

  /**
   * @tab Setter Methods
   */

  /**
   * Sets the player's permission level.
   * @param permission The new permission level.
   */
  public async setPermission(permission: PERMISSION_INTEGER): Promise<OperationResult> {
    return this.updateOne({ $set: { permission: permission } });
  }

  /**
   * Adds coins to the player's balance.
   * @param amount The amount of coins to add.
   */
  public async addCoins(amount: number): Promise<OperationResult> {
    if (amount <= 0) return { success: false, reason: "Amount must be a positive number." };
    return this.updateOne({ $inc: { "balance.coins": amount } });
  }

  /**
   * Removes coins from the player's balance.
   * @param amount The amount of coins to remove.
   */
  public async removeCoins(amount: number): Promise<OperationResult> {
    if (amount <= 0) return { success: false, reason: "Amount must be a positive number." };
    if (this.getCoins() < amount) return { success: false, reason: "Insufficient funds." };
    return this.updateOne({ $inc: { "balance.coins": -amount } });
  }

  /**
   * Sets the player's coin balance to a specific value.
   * @param amount The new coin balance.
   */
  public async setCoins(amount: number): Promise<OperationResult> {
    if (amount < 0) return { success: false, reason: "Amount must be a non-negative number." };
    return this.updateOne({ $set: { "balance.coins": amount } });
  }

  /**
   * Adds XP to the player's balance.
   * @param amount The amount of XP to add.
   */
  public async addXp(amount: number): Promise<OperationResult> {
    if (amount <= 0) return { success: false, reason: "Amount must be a positive number." };
    return this.updateOne({ $inc: { "balance.xp": amount } });
  }

  /**
   * Removes XP from the player's balance.
   * @param amount The amount of XP to remove.
   */
  public async removeXp(amount: number): Promise<OperationResult> {
    if (amount <= 0) return { success: false, reason: "Amount must be a positive number." };
    if (this.getXp() < amount) return { success: false, reason: "Insufficient XP." };
    return this.updateOne({ $inc: { "balance.xp": -amount } });
  }

  /**
 * Sets the player's XP balance to a specific value.
 * @param amount The new XP balance.
 */
  public async setXp(amount: number): Promise<OperationResult> {
    if (amount < 0) return { success: false, reason: "Amount must be a non-negative number." };
    return this.updateOne({ $set: { "balance.xp": amount } });
  }

  /**
   * Adds shards to the player's balance.
   * @param amount The amount of shards to add.
   */
  public async addShards(amount: number): Promise<OperationResult> {
    if (amount <= 0) return { success: false, reason: "Amount must be a positive number." };
    return this.updateOne({ $inc: { "balance.shards": amount } });
  }

  /**
   * Removes shards from the player's balance.
   * @param amount The amount of shards to remove.
   */
  public async removeShards(amount: number): Promise<OperationResult> {
    if (amount <= 0) return { success: false, reason: "Amount must be a positive number." };
    if (this.getShards() < amount) return { success: false, reason: "Insufficient shards." };
    return this.updateOne({ $inc: { "balance.shards": -amount } });
  }

  /**
   * Sets the player's shard balance to a specific value.
   * @param amount The new shard balance.
   */
  public async setShards(amount: number): Promise<OperationResult> {
    if (amount < 0) return { success: false, reason: "Amount must be a non-negative number." };
    return this.updateOne({ $set: { "balance.shards": amount } });
  }

  /**
   * Gives a player a new rank.
   * @param rankId The ID of the rank to give.
   */
  public async addRank(rankId: string): Promise<OperationResult> {
    if (this.hasRank(rankId)) return { success: false, reason: "Player already has this rank." };
    return this._addToArray('ranks', rankId);
  }

  /**
   * Removes a rank from a player.
   * @param rankId The ID of the rank to remove.
   */
  public async removeRank(rankId: string): Promise<OperationResult> {
    if (!this.hasRank(rankId)) return { success: true };
    return this._removeFromArrayByValue('ranks', rankId);
  }

  /**
   * Sets the player's active rank.
   * @param rankId The ID of the rank to set as active.
   */
  public async setRank(rankId: string): Promise<OperationResult> {
    if (!this.hasRank(rankId) && rankId !== "default") return { success: false, reason: "Player does not own this rank." };
    return this.updateOne({ $set: { rank: rankId } });
  }

  /**
   * Sets the player's chat color.
   * @param color The new color.
   */
  public async setChatColor(color: string): Promise<OperationResult> {
    return this.updateOne({ $set: { chatColor: color } });
  }

  /**
   * Sets the player's island UUID.
   * @param uuid The UUID of the island the player belongs to.
   */
  public async setIslandUUID(uuid: string): Promise<OperationResult> {
    return this.updateOne({ $set: { island: uuid } });
  }

  /**
   * Gets a specific setting for the player.
   * @param key The key of the setting to retrieve.
   */
  public getSetting(key: string): string | boolean | undefined {
    return this.data.settings[key];
  }

  /**
   * Sets a setting for the player.
   * @param key The key of the setting to set.
   * @param value The value to set.
   */
  public async setSetting(key: string, value: string | boolean): Promise<OperationResult> {
    return this.updateOne({ $set: { [`settings.${key}`]: value } });
  }

  /**
   * Removes a setting from the player's data.
   * @param key The key of the setting to remove.
   */
  public async removeSetting(key: string): Promise<OperationResult> {
    if (!this.hasSetting(key)) return { success: true };
    return this.updateOne({ $unset: { [`settings.${key}`]: "" } });
  }

  /**
   * Updates the player's last seen time to now.
   */
  public async updateLastSeen(): Promise<OperationResult> {
    return this.updateOne({ $set: { lastSeen: new Date() } });
  }
}

export { PlayerSession };