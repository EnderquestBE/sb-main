import { Vector3f } from "@serenityjs/protocol";
import { Player, World } from "@serenityjs/core";
import { UpdateFilter } from "mongodb";
import { DataManager } from "./Manager";
import { IslandDatabase } from "../Database/Collections/Island";
import { BankLogEntry, IslandData, IslandHome, IslandLimit, IslandLimitType, IslandRole, IslandRoleHierarchy, OperationResult, PlayerInfo } from "../../Types/types";
import { Server } from "../../server";
import { Logger, LoggerColors } from "@serenityjs/logger";
import { IslandLevel, PlayerDatabase } from "..";
import { IslandLimitUnlocks } from "../../Handlers/Island/limits";
import { IslandPerkUnlocks } from "../../Handlers/Island/perks";

/**
 * @name Island
 * Class for manipulating island data.
 */
class Island extends DataManager<IslandData, IslandDatabase> {

  public static readonly logger = new Logger("Island", LoggerColors.MaterialEmerald)

  private static readonly cache = new Map<string, Island>();

  private constructor(initialData: IslandData, dbManager: IslandDatabase) {
    super(initialData, dbManager);
  }

  /**
   * @tab Database Methods
   */

  /**
   * Loads an island's data from the database or cache.
   * @param name The name of the island to load.
   * @param islandDB The island database manager instance.
   */
  public static async load(name: string): Promise<Island | null> {
    if (this.cache.has(name)) {
      return this.cache.get(name)!;
    }
    const islandData = await IslandDatabase.instance.get(name);
    if (!islandData) return null;

    const island = new Island(islandData, IslandDatabase.instance);
    this.cache.set(name, island);
    return island
  }

  /**
 * Loads an island's data from the cache.
 * @param name The name of the island to load.
 * @param islandDB The island database manager instance.
 */
  public static loadSync(name: string): Island | null {
    return this.cache.get(name) ?? null;
  }

  /**
   * Removes an island from the cache.
   * @param name The name of the island to unload.
   */
  public static unload(name: string): void {
    this.cache.delete(name);
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
      ceil: 1,
      size: 10,
      height: 32,
      spawn: new Vector3f(0.5, 5, 0.5),
      world: world,
      members: [],
      helpers: [],
      admins: [],
      coowners: [],
      banned: [],
      bank: 0,
      bankLogs: [],
      limits: {
        crops: { amount: 0, max: 175 },
        spawners: { amount: 0, max: 1 },
        hoppers: { amount: 0, max: 2 },
        coowners: { amount: 0, max: 0 },
        members: { amount: 0, max: 3 },
        homes: { amount: 0, max: 3 },
        bank: { amount: 0, max: 25000 }
      },
      homes: [],
      perks: [],
      commandPermissions: [],
      status: true,
      preset: 'default',
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    await IslandDatabase.instance.create(initialData);
    const island = new Island(initialData, IslandDatabase.instance);
    this.cache.set(name, island);
    return island
  }

  /**
   * @tab Property Methods
   */

  public getName(): string { return this.data.name; }
  public getLevel(): number { return this.data.level; }
  public getPoints(): number { return this.data.points; }
  public getLevelCeil(): number { return this.data.ceil }
  public getSize(): number { return this.data.size; }
  public getHeight(): number { return this.data.height; }
  public getSpawn(): Vector3f { return new Vector3f(this.data.spawn.x, this.data.spawn.y, this.data.spawn.z); }
  public getWorldId(): string { return this.data.world; }
  public getWorld(): World | null { return Server.instance.getWorld(this.getWorldId()); }
  public getMembers(): PlayerInfo[] { return this.data.members; }
  public getHelpers(): PlayerInfo[] { return this.data.helpers; }
  public getAdmins(): PlayerInfo[] { return this.data.admins; }
  public getCoOwners(): PlayerInfo[] { return this.data.coowners; }
  public getBankBalance(): number { return this.data.bank; }
  public getBankLogs(): BankLogEntry[] { return this.data.bankLogs; }
  public getHomes(): IslandHome[] { return this.data.homes; }
  public getBanned(): string[] { return this.data.banned; }
  public getStatus(): boolean { return this.data.status; }
  public getOwner(): PlayerInfo { return this.data.owner; }
  public getFounder(): PlayerInfo { return this.data.founder; }
  public getLimits(): { [key in IslandLimitType]: IslandLimit } { return this.data.limits; }
  public getPerks(): string[] { return this.data.perks; }
  public getCommandPermissions(): string[] { return this.data.commandPermissions; }

  // Data
  public getData(): IslandData {
    return this.data
  }

  public getDataString(): string {
    return JSON.stringify(this.data);
  }

  // Warp
  public teleport(player: Player) {
    player.teleport(this.getSpawn(), Server.instance.getWorld(this.getWorldId())!.getDimension())
  }

  /**
   * @tab Boolean Methods
   */

  /**
   * Checks if a user is a member of the island.
   * @param xuid The XUID of the user to check.
   */
  public isMember(xuid: string): boolean {
    return this.data.members.some(x => x.xuid === xuid) || this.data.owner.xuid === xuid
  }

  /**
   * Checks if a user is a helper of the island.
   * @param xuid The XUID of the user to check.
   */
  public isHelper(xuid: string): boolean {
    return this.data.helpers.some(x => x.xuid === xuid);
  }

  /**
   * Checks if a user is an admin of the island.
   * @param xuid The XUID of the user to check.
   */
  public isAdmin(xuid: string): boolean {
    return this.data.admins.some(x => x.xuid === xuid);
  }

  /**
   * Checks if a user is an owner of the island.
   * @param xuid The XUID of the user to check.
   */
  public isOwner(xuid: string): boolean {
    return this.data.owner.xuid === xuid || this.data.coowners.some(x => x.xuid === xuid);
  }

  /**
   * Checks if a user is banned from the island.
   * @param xuid The XUID of the user to check.
   */
  public isBanned(xuid: string): boolean {
    return this.data.banned.includes(xuid);
  }

  /**
   * Whether or not the island is online and accessible to visitors.
   */
  public isOnline(): boolean {
    return Server.instance.getPlayers().some((x) => this.isOwner(x.xuid))
  }

  /**
   * @tab Boundaries
   */
  public isInBounds(location: Vector3f) {
    const y = location.y
    if (y > this.data.height || y < 0) return false
    const size = this.data.size
    const dist = location.x * location.x + location.z * location.z;
    const radius2 = size * size;
    return dist <= radius2
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
  public getMember(xuid: string): PlayerInfo | undefined {
    return this.data.members.find(m => m.xuid === xuid);
  }

  /**
   * Retrieves the role of a specific island member.
   * @param xuid The XUID of the member.
   */
  public getPlayerRole(xuid: string): IslandRole | undefined {
    if (this.data.helpers.some(m => m.xuid === xuid)) return "helper"
    else if (this.data.admins.some(m => m.xuid === xuid)) return "admin"
    else if (this.data.coowners.some(m => m.xuid === xuid)) return "coowner"
    else if (this.data.owner.xuid === xuid) return "owner"
    return undefined
  }

  /**
   * Gets a rank-based permission level for comparing the abilities of island members.
   * @param xuid The XUID of the member.
   */
  public getPlayerRoleLevel(xuid: string): number | undefined {
    if (this.data.helpers.some(m => m.xuid === xuid)) return IslandRoleHierarchy.helper
    else if (this.data.admins.some(m => m.xuid === xuid)) return IslandRoleHierarchy.admin
    else if (this.data.coowners.some(m => m.xuid === xuid)) return IslandRoleHierarchy.coowner
    else if (this.data.owner.xuid === xuid) return IslandRoleHierarchy.owner
    return undefined
  }

  /** 
   * Checks if the player has the required role or higher. 
   */
  public hasPermission(xuid: string, role: IslandRole) {
    const playerRole = this.getPlayerRole(xuid);
    if (!playerRole) return false
    if (IslandRoleHierarchy[playerRole] >= IslandRoleHierarchy[role]) return true
    return false
  }

  /**
   * Updates the role for a specific member.
   * @param xuid The XUID of the member to update.
   * @param role The new role to assign.
   */
  public async updateMemberRole(xuid: string, username: string, role: IslandRole): Promise<OperationResult> {
    const prevRole = this.getPlayerRole(xuid);
    if (!prevRole) return { success: false, reason: "Player is not a member of this island." }
    if (prevRole === 'owner') return { success: false, reason: "The island owner's role cannot be changed." };

    // Remove from the previous role
    if (prevRole === "helper") await this.removeHelper(xuid);
    else if (prevRole === "admin") await this.removeAdmin(xuid);
    else if (prevRole === "coowner") await this.removeCoOwner(xuid);

    // Add to the new role
    switch (role) {
      case "helper":
        return this.addHelper({ xuid, username });
      case "admin":
        return this.addAdmin({ xuid, username });
      case "coowner":
        return this.addCoOwner({ xuid, username });
    }

    return { success: false, reason: "Invalid role specified." };
  }

  public getOnlineOwners(): Player[] {
    return Server.instance.getPlayers().filter(x => this.isOwner(x.xuid));
  }

  public getMembersInWorld(): Player[] {
    return Server.instance.getWorld(this.getWorldId())!.getPlayers().filter((x) => this.isMember(x.xuid))
  }

  public getInWorld(): Player[] {
    return Server.instance.getWorld(this.getWorldId())!.getPlayers()
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
   * @tab Permissions Methods
   */

  /**
   * Adds a permission string to the island
   * @param permission Permission string to add.
   */
  public async addCommandPermission(permission: string): Promise<OperationResult> {
    if (this.hasCommandPermission(permission)) return { success: false, reason: "Permission is already granted." };
    return this._addToArray('commandPermissions', permission);
  }

  /**
   * Removes a permission string from the island
   * @param permission Permission string to remove.
   */
  public async removeCommandPermissions(permission: string): Promise<OperationResult> {
    if (!this.hasCommandPermission(permission)) return { success: true };
    return this._removeFromArrayByValue('commandPermissions', permission);
  }

  /**
   * Whether or not the island has a permission.
   * @param permission Permission string to check.
   */
  public hasCommandPermission(permission: string): boolean {
    return this.data.commandPermissions.includes(permission);
  }

  /**
   * @tab Perk Methods
   */

  /**
   * Defines a perk as 'unlocked' for the island.
   * @param id Perk ID to add.
   */
  public async addPerk(id: string): Promise<OperationResult> {
    if (this.data.perks.includes(id)) return { success: false, reason: "Perk is already unlocked." };
    return this._addToArray('perks', id);
  }

  /**
   * Removes an unlocked perk from the island.
   * @param id Perk ID to remove.
   */
  public async removePerk(id: string): Promise<OperationResult> {
    if (!this.data.perks.includes(id)) return { success: true };
    return this._removeFromArrayByValue('perks', id);
  }

  /**
   * Whether or not the island has this perk unlocked.
   * @param id Perk ID to check.
   */
  public hasPerk(id: string): boolean {
    return this.data.perks.includes(id);
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
    const oldName = this.getName();
    const newWorldId = `sb_${name}`;

    // Double check to make sure the world doesn't already exist.
    if (Server.instance.getWorld(newWorldId)) {
      return { success: false, reason: "An island with a similar name already exists, causing a world conflict." };
    }

    // Change world identifier.
    const world = Server.instance.getWorld(this.getWorldId())
    if (!world) {
      return { success: false, reason: "Could not find the island's world to rename." };
    }

    const result = await this.updateOne({ $set: { name: name, world: newWorldId } });
    if (!result.success) {
      return { success: false, reason: "Failed to update island name in the database." };
    }

    //@ts-ignore
    world.identifier = newWorldId
    world.properties.identifier = newWorldId
    Server.instance.worlds.delete(oldName)
    Server.instance.worlds.set(newWorldId, world)

    // Update local data.
    this.data.name = name;
    this.data.world = newWorldId

    // Update island name property for island owner player data.
    const owners = [this.data.owner, ...this.data.coowners, ...this.data.admins, ...this.data.helpers, ...this.data.members];
    for (const owner of owners) {
      // Check if the player is online to update their live session data.
      const player = Server.instance.getPlayerByXuid(owner.xuid);
      if (player && player.session()) {
        // Update online players using their session.
        await player.setIslandName(name);
      } else {
        // Update offline players using database directly.
        await PlayerDatabase.instance.updateOne(owner.xuid, { $set: { island: name } });
      }
    }

    // Update island cache.
    if (Island.cache.has(oldName)) {
      Island.cache.delete(oldName);
      Island.cache.set(name, this);
    }

    return result;
  }

  /**
   * Sets a new spawn location for the island.
   * @param spawn The new spawn location.
   */
  public async setSpawn(spawn: Vector3f): Promise<OperationResult> {
    const location = { x: spawn.x, y: spawn.y, z: spawn.z }
    return this.updateOne({ $set: { spawn: location } });
  }

  /**
 * Sets the size radius limit of the island.
 * @param amount The amount to set the size to.
 */
  public async setSize(amount: number): Promise<OperationResult> {
    return this.updateOne({ $set: { size: amount } });
  }

  /**
   * Decreases the size radius limit of the island.
   * @param amount The amount to decrease by.
   */
  public async decreaseSize(amount: number): Promise<OperationResult> {
    const change = Math.min(amount, 10);
    return this.updateOne({ $inc: { size: -change } });
  }

  /**
 * Increases the size radius limit of the island.
 * @param amount The amount to increase by.
 */
  public async increaseSize(amount: number): Promise<OperationResult> {
    return this.updateOne({ $inc: { size: amount } });
  }

  /**
   * Adds points to the island's total.
   * @param amount The number of points to add.
   */
  public async addPoints(amount: number): Promise<OperationResult> {
    await this.updateOne({ $inc: { points: amount } });
    return this.updateLevel();
  }

  /**
   * Removes points from the island's total.
   * @param amount The number of points to remove.
   */
  public async removePoints(amount: number): Promise<OperationResult> {
    const currentPoints = this.getPoints();
    const change = Math.min(currentPoints, amount);
    await this.updateOne({ $inc: { points: -change } });
    return this.updateLevel();
  }

  /**
   * Sets the island's level to a specific value.
   * @param level The new level.
   */
  public async updateLevel(): Promise<OperationResult> {
    const newLevel = IslandLevel.fromPoints(this.data.points);
    const oldCeil = this.data.ceil;

    if (this.data.level === newLevel) {
      return { success: true };
    }

    // If the island level has changed.

    const levelUpdateResult = await this.updateOne({ $set: { level: newLevel } });
    if (!levelUpdateResult.success) {
      return levelUpdateResult;
    }

    // Show levelup message.
    if (oldCeil < newLevel) {
      const members = this.getMembersInWorld();
      for (const member of members) {
        member.onScreenDisplay.updateSubtitle(`§6${oldCeil} §a-> §e${newLevel}`);
        member.onScreenDisplay.setTitle("§eIsland Level Up!");
      }

      // Process unlocks for the new levels gained.
      IslandLimitUnlocks.update(this, false, oldCeil);
      IslandPerkUnlocks.update(this);

      // Finally, update the ceiling in the database. This happens after unlocks.
      await this.updateOne({ $set: { ceil: newLevel } });
    }

    return levelUpdateResult;
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
  public async depositToBank(amount: number, message: string = "No reason provided."): Promise<OperationResult> {
    if (amount <= 0) return { success: false, reason: "Invalid amount to deposit." };
    await this.logBankTransaction({ action: 'deposit', amount, message });
    return this.updateOne({ $inc: { bank: amount } });
  }

  /**
   * Withdraws money from the island bank.
   * @param amount The amount to withdraw.
   * @param message A message describing the transaction.
   */
  public async withdrawFromBank(amount: number, message: string = "No reason provided."): Promise<OperationResult> {
    if (amount <= 0) return { success: false, reason: "Invalid amount to withdraw." };
    if (this.data.bank < amount) return { success: false, reason: "Insufficient funds to withdraw." };
    await this.logBankTransaction({ action: 'withdraw', amount, message });
    return this.updateOne({ $inc: { bank: -amount } });
  }

  /**
   * Adds a new member to the island.
   * @param member The member object to add.
   */
  public async addMember(member: PlayerInfo): Promise<OperationResult> {
    if (this.isMember(member.xuid)) return { success: false, reason: "Player is already a member." };
    this._addToArray('helpers', member);
    return this._addToArray('members', member);
  }

  /**
   * Removes a member from the island.
   * @param xuid The XUID of the member to remove.
   */
  public async removeMember(xuid: string): Promise<OperationResult> {
    if (!this.isMember(xuid)) return { success: true };
    switch (this.getPlayerRole(xuid)) {
      case "helper":
        this._removeFromArrayByField('helpers', 'xuid', xuid);
        break;
      case "admin":
        this._removeFromArrayByField('admins', 'xuid', xuid);
        break;
      case "coowner":
        this._removeFromArrayByField('coowners', 'xuid', xuid);
        break;
    }
    return this._removeFromArrayByField('members', 'xuid', xuid);
  }

  /**
   * Adds a new helper to the island.
   * @param helper The helper object to add.
   */
  public async addHelper(helper: PlayerInfo): Promise<OperationResult> {
    if (this.isHelper(helper.xuid)) return { success: false, reason: "Player is already a helper." };
    return this._addToArray('helpers', helper)
  }

  /**
   * Removes a helper from the island.
   * @param xuid The XUID of the helper to add.
   */
  public async removeHelper(xuid: string): Promise<OperationResult> {
    if (!this.isHelper(xuid)) return { success: true };
    return this._removeFromArrayByField('helpers', 'xuid', xuid);
  }

  /**
   * Adds a new admin to the island.
   * @param member The member object to add.
   */
  public async addAdmin(member: PlayerInfo): Promise<OperationResult> {
    if (this.isAdmin(member.xuid)) return { success: false, reason: "Player is already an admin." };
    return this._addToArray('admins', member);
  }

  /**
   * Removes an admin from the island.
   * @param xuid The XUID of the admin to remove.
   */
  public async removeAdmin(xuid: string): Promise<OperationResult> {
    if (!this.isAdmin(xuid)) return { success: true };
    return this._removeFromArrayByField('admins', 'xuid', xuid);
  }

  /**
   * Adds a new co-owner to the island.
   * @param member The member object to add.
   */
  public async addCoOwner(member: PlayerInfo): Promise<OperationResult> {
    if (this.data.coowners.some(c => c.xuid === member.xuid)) return { success: false, reason: "Player is already a co-owner." };
    return this._addToArray('coowners', member);
  }

  /**
   * Removes a co-owner from the island.
   * @param xuid The XUID of the co-owner to remove.
   */
  public async removeCoOwner(xuid: string): Promise<OperationResult> {
    if (!this.data.coowners.some(c => c.xuid === xuid)) return { success: true };
    return this._removeFromArrayByField('coowners', 'xuid', xuid);
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