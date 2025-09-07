import { Vector3f } from "@serenityjs/protocol";
import { Player } from "@serenityjs/core";
import { UpdateFilter } from "mongodb";
import { DataManager } from "./Manager";
import { IslandDatabase } from "../Database/Collections/Island";
import { BankLogEntry, IslandData, IslandHome, IslandLimit, IslandLimitType, IslandMember, IslandRole, OperationResult, PlayerInfo } from "../../Types/types";

const ROLE_HIERARCHY = Object.values(IslandRole);

/**
 * @name Island
 * Class for manipulating island data.
 */
class Island extends DataManager<IslandData, IslandDatabase> {

  private constructor(initialData: IslandData, dbManager: IslandDatabase) {
    super(initialData, dbManager);
  }

  /**
   * @tab Database Methods
   */

  /**
   * Loads an island's data from the database.
   * @param name The name of the island to load.
   * @param islandDB The island database manager instance.
   */
  public static async load(name: string): Promise<Island | null> {
    const islandData = await IslandDatabase.instance.get(name);
    if (!islandData) return null;
    return new Island(islandData, IslandDatabase.instance);
  }

  /**
   * Creates default island data for database.
   * @param name The name for the new island.
   * @param xuid The founder's XUID.
   * @param spawn The spawn location for the new island.
   * @param world The world the island is in.
   * @param islandDB The island database manager instance.
   */
  public static async createDefault(
    name: string,
    player: Player,
    world: string
  ): Promise<Island> {
    const initialData: IslandData = {
      name: name,
      owner: { xuid: player.xuid, username: player.username },
      founder: { xuid: player.xuid, username: player.username },
      level: 1,
      points: 0,
      size: 16,
      spawn: new Vector3f(0.5, 3, 0.5),
      world: world,
      members: [],
      banned: [],
      bank: 0,
      bankLogs: [],
      limits: {},
      homes: [],
      status: true,
      preset: 'default',
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    await IslandDatabase.instance.create(initialData);
    return new Island(initialData, IslandDatabase.instance);
  }

  /**
   * @tab Property Methods
   */

  public getName(): string { return this.data.name; }
  public getLevel(): number { return this.data.level; }
  public getPoints(): number { return this.data.points; }
  public getSize(): number { return this.data.size; }
  public getSpawn(): Vector3f { return this.data.spawn; }
  public getWorld(): string { return this.data.world; }
  public getMembers(): IslandMember[] { return this.data.members; }
  public getBankBalance(): number { return this.data.bank; }
  public getBankLogs(): BankLogEntry[] { return this.data.bankLogs; }
  public getHomes(): IslandHome[] { return this.data.homes; }
  public getBanned(): string[] { return this.data.banned; }
  public getStatus(): boolean { return this.data.status; }
  public getOwner(): PlayerInfo { return this.data.owner; }
  public getFounder(): PlayerInfo { return this.data.founder; }

  // Data
  public getData(): IslandData {
    return this.data
  }

  public getDataString(): string {
    return JSON.stringify(this.data);
  }


  /**
   * @tab Boolean Methods
   */

  /**
   * Checks if a user is a member of the island.
   * @param xuid The XUID of the user to check.
   */
  public isMember(xuid: string): boolean {
    return this.data.members.some(m => m.xuid === xuid);
  }

  /**
   * Checks if a user is banned from the island.
   * @param xuid The XUID of the user to check.
   */
  public isBanned(xuid: string): boolean {
    return this.data.banned.includes(xuid);
  }

  /**
   * @tab Home Methods
   */
  /**
   * Retrieves home data.
   * @param name Home name.
   */
  public getHome(name: string): IslandHome | undefined {
    return this.data.homes.find(h => h.name.toLowerCase() === name.toLowerCase());
  }

  /**
   * Checks that island has a home with specified name.
   * @param name Home name.
   */
  public hasHome(name: string): boolean {
    return this.data.homes.some(h => h.name.toLowerCase() === name.toLowerCase());
  }

  /**
   * @tab Member Methods
   */
  /**
   * Retrieves the full data object for a member.
   * @param xuid The XUID of the member to find.
   */
  public getMember(xuid: string): IslandMember | undefined {
    return this.data.members.find(m => m.xuid === xuid);
  }

  /**
   * Retrieves the role of a specific member.
   * @param xuid The XUID of the member.
   */
  public getMemberRole(xuid: string): IslandRole | undefined {
    return this.getMember(xuid)?.role;
  }

  /**
   * Updates the role for a specific member.
   * @param xuid The XUID of the member to update.
   * @param role The new role to assign.
   */
  public async updateMemberRole(xuid: string, role: IslandRole): Promise<OperationResult> {
    const result = await this.db.updateMemberRole(this.getName(), xuid, role);
    const success = result.modifiedCount > 0;
    if (success) {
      const member = this.getMember(xuid);
      if (member) member.role = role;
    }
    return { success };
  }

  /**
   * Promotes a member to the next highest role.
   * @param xuid The XUID of the member to promote.
   */
  public async promoteMember(xuid: string): Promise<OperationResult> {
    const member = this.getMember(xuid);
    if (!member) return { success: false, reason: "Player is not a member." };

    const currentRole = ROLE_HIERARCHY.indexOf(member.role);
    if (currentRole >= ROLE_HIERARCHY.length - 1) return { success: false, reason: "Member is already at the highest role." };

    const role = ROLE_HIERARCHY[currentRole + 1]!
    return this.updateMemberRole(xuid, role);
  }

  /**
   * Demotes a member to the next lowest role.
   * @param xuid The XUID of the member to demote.
   */
  public async demoteMember(xuid: string): Promise<OperationResult> {
    const member = this.getMember(xuid);
    if (!member) return { success: false, reason: "Player is not a member." };

    const currentRole = ROLE_HIERARCHY.indexOf(member.role);
    if (currentRole <= 0) return { success: false, reason: "Member is already at the lowest role." };

    const role = ROLE_HIERARCHY[currentRole - 1]!
    return this.updateMemberRole(xuid, role);
  }

  /**
   * @tab Limit Methods
   */
  /**
   * Gets the current and maximum values for a limit.
   * @param type The type of limit to get.
   */
  public getLimit(type: IslandLimitType): IslandLimit {
    return this.data.limits[type] ?? { amount: 0, max: 0 };
  }

  /**
   * Checks if a limit has been reached or exceeded.
   * @param type The type of limit to check.
   */
  public isLimitReached(type: IslandLimitType): boolean {
    const limit = this.getLimit(type);
    return limit.amount >= limit.max;
  }

  /**
   * Increases the used count of a specific limit.
   * @param type The limit to increment.
   * @param amount The amount to increment by (defaults to 1).
   */
  public async incrementLimit(type: IslandLimitType, amount: number = 1): Promise<OperationResult> {
    if (this.isLimitReached(type)) return { success: false, reason: "Limit has been reached." };
    const updateDoc = { $inc: { [`limits.${type}.amount`]: amount } };
    return this.updateOne(updateDoc);
  }

  /**
   * Decreases the used count of a specific limit.
   * @param type The limit to decrement.
   * @param amount The amount to decrement by (defaults to 1).
   */
  public async decrementLimit(type: IslandLimitType, amount: number = 1): Promise<OperationResult> {
    const currentAmount = this.getLimit(type).amount;
    const change = Math.min(currentAmount, amount);
    if (change <= 0) return { success: true };
    const updateDoc = { $inc: { [`limits.${type}.amount`]: -change } };
    return this.updateOne(updateDoc);
  }

  /**
   * Increases the maximum allowed value for a limit.
   * @param type The limit to modify.
   * @param amount The amount to increase the maximum by.
   */
  public async increaseMaxLimit(type: IslandLimitType, amount: number): Promise<OperationResult> {
    const updateDoc = { $inc: { [`limits.${type}.max`]: amount } };
    return this.updateOne(updateDoc);
  }

  /**
   * Decreases the maximum allowed value for a limit.
   * @param type The limit to modify.
   * @param amount The amount to decrease the maximum by.
   */
  public async decreaseMaxLimit(type: IslandLimitType, amount: number): Promise<OperationResult> {
    const currentMax = this.getLimit(type).max;
    const change = Math.min(currentMax, amount);
    if (change <= 0) return { success: true };
    const updateDoc = { $inc: { [`limits.${type}.max`]: -change } };
    return this.updateOne(updateDoc);
  }

  /**
   * @tab Bank Methods
   */
  /**
   * Adds a new entry to the island's bank transaction log.
   * @param log The transaction data to log.
   */
  private async logBankTransaction(log: Omit<BankLogEntry, 'timestamp'>): Promise<void> {
    const entry: BankLogEntry = { ...log, timestamp: new Date() };
    //@ts-ignore
    const updateDoc = {
      $push: {
        bankLogs: {
          $each: [entry],
          $slice: -255
        }
      }
    } as UpdateFilter<IslandData>;

    const result = await this.updateOne(updateDoc);
    if (result.success) {
      if (!this.data.bankLogs) this.data.bankLogs = [];
      this.data.bankLogs.push(entry);
      if (this.data.bankLogs.length > 255) {
        this.data.bankLogs.shift();
      }
    }
  }

  /**
   * @tab Setter Methods
   */
  /**
   * Sets a new name for the island.
   * @param name The new name for the island.
   */
  public async setName(name: string): Promise<OperationResult> {
    return this.updateOne({ $set: { name: name } });
  }

  /**
   * Sets a new spawn location for the island.
   * @param spawn The new spawn location.
   */
  public async setSpawn(spawn: Vector3f): Promise<OperationResult> {
    return this.updateOne({ $set: { spawn: spawn } });
  }

  /**
   * Adds points to the island's total.
   * @param amount The number of points to add.
   */
  public async addPoints(amount: number): Promise<OperationResult> {
    return this.updateOne({ $inc: { points: amount } });
  }

  /**
   * Removes points from the island's total.
   * @param amount The number of points to remove.
   */
  public async removePoints(amount: number): Promise<OperationResult> {
    const currentPoints = this.getPoints();
    const change = Math.min(currentPoints, amount);
    if (change <= 0) return { success: true };
    return this.updateOne({ $inc: { points: -change } });
  }

  /**
   * Sets the island's level to a specific value.
   * @param level The new level.
   */
  public async setLevel(level: number): Promise<OperationResult> {
    return this.updateOne({ $set: { level: level } });
  }

  /**
   * Sets a new owner for the island.
   * @param xuid The XUID of the new owner.
   */
  public async setOwner(xuid: string, username: string): Promise<OperationResult> {
    return this.updateOne({ $set: { owner: { xuid, username } } });
  }

  /**
   * Deposits money into the island bank.
   * @param amount The amount to deposit.
   * @param message A message describing the transaction.
   */
  public async depositToBank(amount: number, message: string): Promise<OperationResult> {
    if (amount <= 0) return { success: false, reason: "Deposit amount must be positive." };
    await this.logBankTransaction({ action: 'deposit', amount, message });
    return this.updateOne({ $inc: { bank: amount } });
  }

  /**
   * Withdraws money from the island bank.
   * @param amount The amount to withdraw.
   * @param message A message describing the transaction.
   */
  public async withdrawFromBank(amount: number, message: string): Promise<OperationResult> {
    if (amount <= 0) return { success: false, reason: "Withdrawal amount must be positive." };
    if (this.data.bank < amount) return { success: false, reason: "Insufficient funds." };
    await this.logBankTransaction({ action: 'withdraw', amount, message });
    return this.updateOne({ $inc: { bank: -amount } });
  }

  /**
   * Adds a new member to the island.
   * @param member The member object to add.
   */
  public async addMember(member: IslandMember): Promise<OperationResult> {
    if (this.isMember(member.xuid)) return { success: false, reason: "Player is already a member." };
    return this._addToArray('members', member);
  }

  /**
   * Removes a member from the island.
   * @param xuid The XUID of the member to remove.
   */
  public async removeMember(xuid: string): Promise<OperationResult> {
    if (!this.isMember(xuid)) return { success: true };
    return this._removeFromArrayByField('members', 'xuid', xuid);
  }

  /**
   * Bans a user from visiting the island.
   * @param xuid The XUID of the user to ban.
   */
  public async banPlayer(xuid: string): Promise<OperationResult> {
    if (this.isBanned(xuid)) return { success: false, reason: "Player is already banned." };
    return this._addToArray('banned', xuid);
  }

  /**
   * Unbans a user from the island.
   * @param xuid The XUID of the user to unban.
   */
  public async unbanPlayer(xuid: string): Promise<OperationResult> {
    if (!this.isBanned(xuid)) return { success: true };
    return this._removeFromArrayByValue('banned', xuid);
  }

  /**
   * Adds a new home to the island.
   * @param home The home object to add.
   */
  public async addHome(home: IslandHome): Promise<OperationResult> {
    if (this.hasHome(home.name)) return { success: false, reason: "A home with that name already exists." };
    return this._addToArray('homes', home);
  }

  /**
   * Removes a home from the island.
   * @param name The name of the home to remove.
   */
  public async removeHome(name: string): Promise<OperationResult> {
    if (!this.hasHome(name)) return { success: true };
    return this._removeFromArrayByField('homes', 'name', name);
  }

  /**
   * Toggles the public status of the island (open/closed).
   */
  public async toggleStatus(): Promise<OperationResult> {
    const status = this.getStatus();
    return this.updateOne({ $set: { status: !status } });
  }
}


export { Island }