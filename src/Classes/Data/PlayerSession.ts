import { DEFAULT_PLAYER_DATA, PERMISSION_INTEGER, PlayerRank, RANKS } from "../../Configuration/config";
import { OperationResult, PlayerData, RankInfo } from "../../Types/types";
import { DataManager } from "./Manager";
import { Island } from "./Island";
import { PlayerDatabase } from "../Database/Collections/Player";
import { Setting } from "../../Configuration/Settings/settings";


/**
 * @name PlayerSession
 * Class for manipulating a player's session data.
 */
class PlayerSession extends DataManager<PlayerData, PlayerDatabase> {
  public createdAt: number

  private constructor(initialData: PlayerData, dbManager: PlayerDatabase) {
    super(initialData, dbManager);
    this.createdAt = Date.now()
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
    playerData.settings = { ...DEFAULT_PLAYER_DATA.settings, ...playerData.settings }
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
    const initialData: PlayerData = structuredClone(DEFAULT_PLAYER_DATA)
    initialData.xuid = xuid;
    initialData.username = username;
    initialData.lastUpdated = now;
    initialData.lastSeen = now;
    const data = await playerDB.get(xuid)
    if (data) {
      initialData.timePlayed = data.timePlayed
      playerDB.delete(xuid);
    }
    await playerDB.create(initialData);
    return new PlayerSession(initialData, playerDB);
  }

  /**
   * @tab Property Methods
   */
  public getXuid(): string { return this.data.xuid; }
  public getUsername(): string { return this.data.username; }
  public getPermission(): PERMISSION_INTEGER { return this.data.permission; }
  public getMoney(): number { return this.data.balance.money; }
  public getXp(): number { return this.data.balance.xp; }
  public getRankIds(): string[] { return this.data.ranks; }
  public getRank(): RankInfo { return RANKS.get(this.data.rank as PlayerRank)!; }
  public getChatColor(): string { return this.data.chatColor }
  public getIslandName(): string { return this.data.island; }
  public getIsland(): Island | null { return Island.loadSync(this.data.island) }
  public async getIslandAsync(): Promise<Island | null> { return await Island.load(this.data.island) }
  public getSettings(): { [key in Setting]: string | boolean } { return this.data.settings; }
  public getLastSeen(): Date { return this.data.lastSeen; }
  public getLastUpdated(): Date { return this.data.lastUpdated; }

  /**
 * Calculates the time played value from stored time played and session duration.
 */
  public getTimePlayed(): number {
    return this.data.timePlayed + Math.floor((Date.now() - this.createdAt) / 1000);
  }

  public setTimePlayed(value: number): Promise<OperationResult> {
    return this.updateOne({ $set: { timePlayed: value } });
  }

  // Data
  public getDataString(): string {
    return JSON.stringify(this.data);
  }

  public getDataProperty(key: keyof PlayerData): any {
    return this.data[key as keyof PlayerData];
  }

  /**

  /**
   * @tab Boolean Methods
   */

  /**
   * Checks if the player owns a specific rank.
   * @param rankId The ID of the rank to check.
   */
  public hasRank(rankId: keyof typeof PlayerRank): boolean {
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
   * Adds money to the player's balance.
   * @param amount The amount of money to add.
   */
  public async addMoney(amount: number): Promise<OperationResult> {
    if (amount <= 0) return { success: false, reason: "Amount must be a positive number." };
    return this.updateOne({ $inc: { "balance.money": amount } });
  }

  /**
   * Removes money from the player's balance.
   * @param amount The amount of money to remove.
   */
  public async removeMoney(amount: number): Promise<OperationResult> {
    if (amount <= 0) return { success: false, reason: "Amount must be a positive number." };
    if (this.getMoney() < amount) return { success: false, reason: "Insufficient funds." };
    return this.updateOne({ $inc: { "balance.money": -amount } });
  }

  /**
   * Sets the player's coin balance to a specific value.
   * @param amount The new coin balance.
   */
  public async setMoney(amount: number): Promise<OperationResult> {
    if (amount < 0) return { success: false, reason: "Amount must be a non-negative number." };
    return this.updateOne({ $set: { "balance.money": amount } });
  }

  /**
   * Adds XP to the player's balance.
   * @param amount The amount of XP to add.
   */
  public async addXp(amount: number): Promise<OperationResult> {
    return this.updateOne({ $inc: { "balance.xp": amount } });
  }

  /**
   * Removes XP from the player's balance.
   * @param amount The amount of XP to remove.
   */
  public async removeXp(amount: number): Promise<OperationResult> {
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
   * Gives a player a new rank.
   * @param rankId The ID of the rank to give.
   */
  public async addRank(rankId: keyof typeof PlayerRank): Promise<OperationResult> {
    if (this.hasRank(rankId)) return { success: false, reason: "Player already has this rank." };
    return this._addToArray('ranks', rankId);
  }

  /**
   * Removes a rank from a player.
   * @param rankId The ID of the rank to remove.
   */
  public async removeRank(rankId: keyof typeof PlayerRank): Promise<OperationResult> {
    if (!this.hasRank(rankId)) return { success: true };
    return this._removeFromArrayByValue('ranks', rankId);
  }

  /**
   * Sets the player's active rank.
   * @param rankId The ID of the rank to set as active.
   */
  public async setRank(rankId: keyof typeof PlayerRank): Promise<OperationResult> {
    if (!this.hasRank(rankId)) return { success: false, reason: "Player does not own this rank." };
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
   * Sets the player's island name.
   * @param islandName The name of the island the player belongs to.
   */
  public async setIslandName(islandName: string): Promise<OperationResult> {
    return this.updateOne({ $set: { island: islandName } });
  }

  /**
   * Gets a specific setting for the player.
   * @param key The key of the setting to retrieve.
   */
  public getSetting(key: keyof PlayerData["settings"]): string | boolean | undefined {
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
   * Updates the player's last seen time to now.
   */
  public async updateLastSeen(): Promise<OperationResult> {
    return this.updateOne({ $set: { lastSeen: new Date() } });
  }
}

export { PlayerSession };