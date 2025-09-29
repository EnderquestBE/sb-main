import { BanEntry, ModerationData, ModerationRecordEntry, OperationResult, WhitelistMode } from "../../Types/types";
import { DataManager } from "./Manager";
import { ModerationDatabase } from "../Database";
import { DEFAULT_MODERATION_DATA } from "../../Configuration/Data";
import { Player } from "@serenityjs/core";
import { Server } from "../../server";

class ModerationManager extends DataManager<ModerationData, ModerationDatabase> {
    public static instance: ModerationManager;
    public constructor(initialData: ModerationData, dbManager: ModerationDatabase) {
        super(initialData, dbManager);
    }

    public static async initialize(): Promise<void> {
        if (ModerationManager.instance) {
            console.warn("ModerationManager is already initialized.");
            return;
        }
        let moderationData = await ModerationDatabase.instance.get("default");
        if (!moderationData) {
            const data = { ...DEFAULT_MODERATION_DATA, moderation: "default" };
            await ModerationDatabase.instance.create(data);
            moderationData = data;
        }
        ModerationManager.instance = new ModerationManager(moderationData, ModerationDatabase.instance);
        // Log whitelist method.
        const manager = ModerationManager.instance;
        Server.logger.info(`§bWhitelist is ${manager.whitelistMode === "OPEN" ? "§cinactive" : "§aactive"} §7(§fMode: §e${manager.whitelistMode}§7)${manager.whitelistMode === "ALLOW" ? `\n§fWhitelisted: §7${manager.users.join(", ")}` : (manager.whitelistMode === "RESTRICTED" ? `\n§cMinimum Permission: §6${manager.permissionLevel}` : "")}`);

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
}


export { ModerationManager };