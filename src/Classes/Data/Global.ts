import { BanEntry, GlobalServerData, ModerationRecordEntry, Multiplier, OperationResult, WhitelistMode } from "../../Types/types";
import { DataManager } from "./Manager";
import { GlobalDatabase } from "../Database";
import { DEFAULT_SERVER_DATA } from "../../Configuration/Data";
import { Player } from "@serenityjs/core";
import { Server } from "../../server";

class GlobalDataManager extends DataManager<GlobalServerData, GlobalDatabase> {
    public static instance: GlobalDataManager;
    public constructor(initialData: GlobalServerData, dbManager: GlobalDatabase) {
        super(initialData, dbManager);
    }

    public static async initialize(): Promise<void> {
        if (GlobalDataManager.instance) {
            console.warn("GlobalDataManager is already initialized.");
            return;
        }
        let globalServerData = await GlobalDatabase.instance.get("default");
        if (!globalServerData) {
            const data = { ...DEFAULT_SERVER_DATA, global: "default" };
            await GlobalDatabase.instance.create(data);
            globalServerData = data;
        }
        GlobalDataManager.instance = new GlobalDataManager(globalServerData!, GlobalDatabase.instance);
        // Log whitelist method.
        const manager = GlobalDataManager.instance;
        Server.logger.info(`§bWhitelist is ${manager.whitelistMode === "OPEN" ? "§cinactive" : "§aactive"} §7(§fMode: §e${manager.whitelistMode}§7)${manager.whitelistMode === "ALLOW" ? `\n§fWhitelisted: §7${manager.users.join(", ")}` : (manager.whitelistMode === "RESTRICTED" ? `\n§cMinimum Permission: §6${manager.permissionLevel}` : "")}`);
        Server.initializeMultipliers();
    }

    public get whitelistMode(): WhitelistMode {
        return this.data.whitelist.mode;
    }

    public get users(): string[] {
        return this.data.whitelist.properties.allowlist;
    }

    public get permissionLevel(): number {
        return this.data.whitelist.properties.permissionLevel;
    }

    public get globalMultipliers(): Multiplier[] {
        return this.data.globalMultipliers;
    }

    /**
     * Adds a ban entry to the database.
     * @param banEntry The ban entry to add.
     */
    public async createBan(banEntry: BanEntry): Promise<OperationResult> {
        return this._addToArray("activeBans", banEntry);
    }

    /**
     * Removes a ban entry from the database.
     * @param xuid The XUID of the player to unban.
     */
    public async removeBan(xuid: string): Promise<OperationResult> {
        return this._removeFromArrayByField("activeBans", "xuid", xuid);
    }

    /**
     * Gets a ban entry for a player.
     * @param xuid The XUID of the player to get the ban entry for.
     */
    public getBan(xuid: string): BanEntry | null {
        return this.data.activeBans.find(entry => entry.xuid === xuid) ?? null;
    }

    /**
     * Adds a moderation record to a player's history.
     * @param xuid The XUID of the player.
     * @param recordEntry The moderation record to add.
     */
    public async addModerationHistory(xuid: string, recordEntry: ModerationRecordEntry): Promise<OperationResult> {
        const key = `moderationHistory.${xuid}`;
        const updateDoc = { $push: { [key]: recordEntry } } as any;
        return this.updateOne(updateDoc);
    }

    /**
     * Gets the moderation history for a player.
     * @param xuid The XUID of the player.
     */
    public getModerationHistory(xuid: string): ModerationRecordEntry[] {
        return this.data.moderationHistory[xuid] ?? [];
    }

    /**
     * Sets the whitelist mode.
     * @param mode The whitelist mode to set.
     */
    public async setWhitelistMode(mode: WhitelistMode): Promise<OperationResult> {
        return this.updateOne({ $set: { "whitelist.mode": mode } });
    }

    /**
     * Sets the permission level required for restricted mode.
     * @param level The permission level to set.
     */
    public async setWhitelistPermissionLevel(level: number): Promise<OperationResult> {
        return this.updateOne({ $set: { "whitelist.properties.permissionLevel": level } });
    }

    /**
     * Adds a player to the whitelist.
     * @param username The username of the player to add.
     */
    public async addToWhitelist(username: string): Promise<OperationResult> {
        if (this.users.includes(username)) {
            return { success: false, reason: "Player is already whitelisted." };
        }
        const updateDoc = { $push: { "whitelist.properties.allowlist": username } } as any;
        const result = await this.updateOne(updateDoc);
        if (result.success) {
            this.data.whitelist.properties.allowlist.push(username);
        }
        return result;
    }

    /**
     * Removes a player from the whitelist.
     * @param username The username of the player to remove.
     */
    public async removeFromWhitelist(username: string): Promise<OperationResult> {
        const updateDoc = { $pull: { "whitelist.properties.allowlist": username } } as any;
        const result = await this.updateOne(updateDoc);
        if (result.success) {
            const arr = this.data.whitelist.properties.allowlist;
            const idx = arr.indexOf(username);
            if (idx !== -1) arr.splice(idx, 1);
        }
        return result;
    }

    /**
     * Checks if a player is whitelisted.
     * @param player The player to check.
     */
    public isWhitelisted(player: Player): boolean {
        if (this.whitelistMode === "OPEN") return true;
        else if (this.whitelistMode === "CLOSED") return false;
        else if (this.whitelistMode === "ALLOW") {
            return this.users.includes(player.username);
        } else if (this.whitelistMode === "RESTRICTED") {
            return player.getPermission() >= this.permissionLevel;
        } else return false;
    }

    /**
     * Adds a new global multiplier.
     * @param multiplier The multiplier to add.
     */
    public async addGlobalMultiplier(multiplier: Multiplier): Promise<OperationResult> {
        return this._addToArray("globalMultipliers", multiplier);
    }

    /**
     * Removes a global multiplier by its ID.
     * @param id The ID of the multiplier to remove.
     */
    public async removeGlobalMultiplier(id: string): Promise<OperationResult> {
        return this._removeFromArrayByField("globalMultipliers", "id", id);
    }
}


export { GlobalDataManager };