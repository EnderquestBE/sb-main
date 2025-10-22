import { DEFAULT_PLAYER_DATA, DEFAULT_PREMIUM_DATA, PERMISSION_INTEGER, PlayerRank, RANKS } from "../../Configuration/config";
import { OperationResult, PlayerData, PremiumData, RankInfo, VanityInfo } from "../../Types/types";
import { DataManager } from "./Manager";
import { Island } from "./Island";
import { PlayerDatabase } from "../Database/Collections/Player";
import { Setting } from "../../Configuration/Settings/settings";
import { VanityItems } from "../../Configuration/Vanity";
import { PremiumDatabase } from "../Database";

/**
 * @name PlayerSession
 * Class for manipulating a player's session data.
 */
class PlayerSession extends DataManager<PlayerData, PlayerDatabase> {
  public createdAt: number;
  public premiumData: PremiumData;

  private constructor(initialData: PlayerData, premiumData: PremiumData, dbManager: PlayerDatabase) {
    super(initialData, dbManager);
    this.createdAt = Date.now();
    this.premiumData = premiumData;
    this.updateLastSeen();
  }

  /**
   * @tab Database Methods
   */

  /**
   * Loads a player's data from the database.
   * @param xuid The XUID of the player to load.
   * @param playerDB The player database manager instance.
   */
  public static async load(xuid: string, playerDB: PlayerDatabase, premiumDB: PremiumDatabase): Promise<PlayerSession | null> {
    const playerData = await playerDB.get(xuid);
    if (!playerData) return null;
    playerData.settings = { ...DEFAULT_PLAYER_DATA.settings, ...playerData.settings };

    let premiumData = await premiumDB.get(xuid);
    if (!premiumData) {
      const newPremiumData: PremiumData = { ...DEFAULT_PREMIUM_DATA, xuid };
      await premiumDB.create(newPremiumData);
      premiumData = newPremiumData;
    }

    return new PlayerSession(playerData, premiumData, playerDB);
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
    playerDB: PlayerDatabase,
    premiumDB: PremiumDatabase
  ): Promise<PlayerSession> {
    const now = new Date();
    const initialData: PlayerData = structuredClone(DEFAULT_PLAYER_DATA)
    initialData.xuid = xuid;
    initialData.username = username;
    initialData.lastUpdated = now;
    initialData.lastSeen = now;
    initialData.firstSeen = now;
    const data = await playerDB.get(xuid)
    if (data) {
      initialData.timePlayed = data.timePlayed
      playerDB.delete(xuid);
    }
    await playerDB.create(initialData);

    const initialPremiumData: PremiumData = structuredClone(DEFAULT_PREMIUM_DATA);
    initialPremiumData.xuid = xuid;
    await premiumDB.create(initialPremiumData);

    return new PlayerSession(initialData, initialPremiumData, playerDB);
  }

  /**
   * @tab Property Methods
   */
  public getXuid(): string { return this.data.xuid; }
  public getUsername(): string { return this.data.username; }
  public getPermission(): PERMISSION_INTEGER { return this.data.permission; }
  public getMoney(): number { return this.data.balance.money; }
  public getXp(): number { return this.data.balance.xp; }
  public getRankIds(): string[] { return this.premiumData.ranks; }
  public getPrimaryRank(): RankInfo { return RANKS.get(this.data.activeRanks[0] as PlayerRank)!; }
  public getActiveRanks(): RankInfo[] { return this.data.activeRanks.map(id => RANKS.get(id as PlayerRank)!) }
  public getChatSize(): boolean { return this.data.chatSize }
  public getChatColor(): string { return this.data.chatColor }
  public getIslandName(): string { return this.data.island; }
  public getIsland(): Island | null { return Island.loadSync(this.data.island) }
  public async getIslandAsync(): Promise<Island | null> { return await Island.load(this.data.island) }
  public getIslandsMemberOf(): string[] { return this.data.memberOf; }
  public isMemberOfIsland(islandName: string): boolean { return this.data.memberOf.includes(islandName); }
  public getSettings(): { [key in Setting]: string | boolean } { return this.data.settings; }
  public getLastSeen(): Date { return this.data.lastSeen; }
  public getLastUpdated(): Date { return this.data.lastUpdated; }

  public async updateUsername(newUsername: string): Promise<OperationResult> {
    return this.updateOne({ $set: { username: newUsername } });
  }

  /**
  * Calculates the time played value from stored time played and session duration.
  */
  public getTimePlayed(): number {
    return this.data.timePlayed + Math.floor((Date.now() - this.createdAt) / 1000);
  }

  public setTimePlayed(value: number): Promise<OperationResult> {
    return this.updateOne({ $set: { timePlayed: value } });
  }

  public getAllCriteria(): { [key in keyof PlayerData["stats"]]: number } {
    return this.data.stats;
  }

  public getCriteria(stat: keyof PlayerData["stats"]): number {
    return this.data.stats[stat] || 0;
  }

  public incrementCriteria(stat: keyof PlayerData["stats"], value: number = 1): Promise<OperationResult> {
    return this.updateOne({ $inc: { [`stats.${stat}`]: value } });
  }

  public decrementCriteria(stat: keyof PlayerData["stats"], value: number = 1): Promise<OperationResult> {
    return this.updateOne({ $inc: { [`stats.${stat}`]: -value } });
  }

  public updateCriteria(stat: keyof PlayerData["stats"], value: number): Promise<OperationResult> {
    return this.updateOne({ $set: { [`stats.${stat}`]: value } });
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
    return this.premiumData.ranks.includes(rankId);
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
     * Unlocks a vanity item for the player.
     * @param vanityId The ID of the vanity item to unlock.
     */
  public async unlockVanity(vanityId: string): Promise<OperationResult> {
    const premiumDB = PremiumDatabase.instance;
    const result = await premiumDB.updateOne(this.getXuid(), { $addToSet: { vanity: vanityId } });
    if (result.modifiedCount > 0) {
      this.premiumData.vanity.push(vanityId);
      return { success: true };
    }
    return { success: false };
  }

  /**
   * Unlocks all vanity items for the player.
   */
  public async unlockAllVanity(): Promise<OperationResult> {
    const premiumDB = PremiumDatabase.instance;
    const allVanityIds = VanityItems.keys().toArray();
    const newVanity = allVanityIds.filter(id => !this.premiumData.vanity.includes(id));
    if (newVanity.length === 0) {
      return { success: false, reason: "Player already owns all vanity items." };
    }
    const result = await premiumDB.updateOne(this.getXuid(), { $addToSet: { vanity: { $each: newVanity } } });
    if (result.modifiedCount > 0) {
      this.premiumData.vanity.push(...newVanity);
      return { success: true };
    }
    return { success: false };
  }

  /**
   * Revokes a vanity item from the player.
   * @param vanityId The ID of the vanity item to revoke.
   */
  public async revokeVanity(vanityId: string): Promise<OperationResult> {
    const premiumDB = PremiumDatabase.instance;
    const result = await premiumDB.updateOne(this.getXuid(), { $pull: { vanity: vanityId } });
    if (result.modifiedCount > 0) {
      this.premiumData.vanity = this.premiumData.vanity.filter(v => v !== vanityId);
      return { success: true };
    }
    return { success: false };
  }

  /**
   * Gets the list of vanity items owned by the player.
   */
  public getOwnedVanity(): VanityInfo[] {
    return this.premiumData.vanity.map(vanityId => VanityItems.get(vanityId)).filter((x): x is VanityInfo => x !== undefined);
  }

  /**
   * Gives a player a new rank.
   * @param rankId The ID of the rank to give.
   */
  public async addRank(rankId: keyof typeof PlayerRank): Promise<OperationResult> {
    if (this.premiumData.ranks.includes(rankId)) return { success: false, reason: "Player already has this rank." };
    const premiumDB = PremiumDatabase.instance;
    const result = await premiumDB.updateOne(this.getXuid(), { $addToSet: { ranks: rankId } });
    if (result.modifiedCount > 0) {
      this.premiumData.ranks.push(rankId);
      return { success: true };
    }
    return { success: false };
  }

  /**
   * Removes a rank from a player.
   * @param rankId The ID of the rank to remove.
   */
  public async removeRank(rankId: keyof typeof PlayerRank): Promise<OperationResult> {
    if (!this.premiumData.ranks.includes(rankId)) return { success: true };
    const premiumDB = PremiumDatabase.instance;
    const result = await premiumDB.updateOne(this.getXuid(), { $pull: { ranks: rankId } });
    if (result.modifiedCount > 0) {
      this.premiumData.ranks = this.premiumData.ranks.filter(r => r !== rankId);
      return { success: true };
    }
    return { success: false };
  }
  /**
   * Pushes a rank to the player's active ranks.
   * @param rankId The ID of the rank to push.
   */
  public async pushActiveRank(rankId: keyof typeof PlayerRank): Promise<OperationResult> {
    if (!this.hasRank(rankId)) return { success: false, reason: "Player does not own this rank." };
    return this._addToArray('activeRanks', rankId);
  }

  /**
   * Pops a rank from the player's active ranks.
   */
  public async popActiveRank(): Promise<OperationResult> {
    if (this.data.activeRanks.length <= 1) return { success: false, reason: "You must have at least one active rank." };
    const newRanks = [...this.data.activeRanks];
    newRanks.pop();
    return this.updateOne({ $set: { activeRanks: newRanks } });
  }

  /**
   * Sets the player's chat size preference.
   * @param large True for large chat, false for small chat.
   */
  public async setChatSize(large: boolean): Promise<OperationResult> {
    return this.updateOne({ $set: { chatSize: large } });
  }

  /**
   * Sets the player's chat color.
   * @param color The new color.
   */
  public async setChatColor(color: string): Promise<OperationResult> {
    return this.updateOne({ $set: { chatColor: color } });
  }

  // Vanity

  /**
   * Equips a vanity item to the specified slot.
   * @param slot The slot number (1-3).
   * @param vanityId The ID of the vanity item to equip.
   */
  public async equipVanity(slot: 1 | 2 | 3, vanityId: string): Promise<OperationResult> {
    // Not implemented yet.
    return this.updateOne({ $set: { [`equippedVanity.${slot}`]: vanityId } });
  }

  /**
  * Unequips a vanity item from the specified slot.
  * @param slot The slot number (1-3).
  */
  public async unequipVanity(slot: 1 | 2 | 3): Promise<OperationResult> {
    // Not implemented yet.
    return this.updateOne({ $set: { [`equippedVanity.${slot}`]: null } });
  }

  /**
   * Gets the vanity item equipped in the specified slot.
   * @param slot The slot number (1-3).
   */
  public getVanity(slot: 1 | 2 | 3): VanityInfo | null {
    return this.data.equippedVanity[slot] ? VanityItems.get(this.data.equippedVanity[slot]!) || null : null;
  }

  /**
   * Gets all vanity items equipped by the player.
   */
  public getEquippedVanity(): (VanityInfo | null)[] {
    return [this.getVanity(1), this.getVanity(2), this.getVanity(3)];
  }

  /**
   * Gets the index of a vanity item in the player's owned vanity list.
   * @param vanityId The ID of the vanity item.
   */
  public indexOfVanity(vanityId: string): 1 | 2 | 3 | -1 {
    if (this.data.equippedVanity[1] === vanityId) return 1;
    if (this.data.equippedVanity[2] === vanityId) return 2;
    if (this.data.equippedVanity[3] === vanityId) return 3;
    return -1;
  }

  /**
   * Checks if the player owns a specific vanity item.
   * @param vanityId The ID of the vanity item.
   */
  public ownsVanity(vanityId: string): boolean {
    return this.premiumData.vanity.includes(vanityId);
  }

  /**
   * Sets the player's island name.
   * @param islandName The name of the island the player belongs to.
   */
  public async setIslandName(islandName: string): Promise<OperationResult> {
    return this.updateOne({ $set: { island: islandName } });
  }

  /**
   * Adds an island to the list of islands a player is a member of.
   * @param islandName The name of the island to add the player to.
   */
  public async setMemberOfIsland(islandName: string): Promise<OperationResult> {
    if (this.isMemberOfIsland(islandName)) return { success: true };
    return this._addToArray('memberOf', islandName);
  }

  public async unsetMemberOfIsland(islandName: string): Promise<OperationResult> {
    if (!this.isMemberOfIsland(islandName)) return { success: true };
    return this._removeFromArrayByValue('memberOf', islandName);
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