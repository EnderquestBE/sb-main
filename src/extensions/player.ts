
import { Player } from "@serenityjs/core";
import { PlayerSession } from "../Classes/Data/PlayerSession";
import { PlayerDatabase } from "../Classes/Database/Collections/Player";
import { OperationResult, PlayerData, RankInfo } from "../Types/types";
import { ChatSource, DEFAULT_PLAYER_DATA, PERMISSION_INTEGER } from "../Configuration/config";
import { PlayerRank, RANKS } from "../Configuration/Ranks/ranks";
import { Island } from "../Classes/Data/Island";
import { Setting } from "../Configuration/Settings/settings";

const sessionSymbol = Symbol("player-session");

declare module "@serenityjs/core" {
  interface Player {
    [sessionSymbol]?: PlayerSession;
    session(): PlayerSession | null;

    getTimePlayed(): number
    setTimePlayed(value: number): Promise<OperationResult>

    // Data
    getDataString(): string
    getDataProperty(key: keyof PlayerData): any;

    // Chat
    info(message: string, source?: ChatSource): void
    warn(message: string, source?: ChatSource): void
    error(message: string, source?: ChatSource): void

    // Permissions
    getPermission(): PERMISSION_INTEGER;
    setPermission(permission: PERMISSION_INTEGER): Promise<OperationResult>;

    // Balance
    getMoney(): number;
    addMoney(amount: number): Promise<OperationResult>;
    removeMoney(amount: number): Promise<OperationResult>;
    setMoney(amount: number): Promise<OperationResult>;
    getXp(): number;
    addXp(amount: number): Promise<OperationResult>;
    removeXp(amount: number): Promise<OperationResult>;
    setXp(amount: number): Promise<OperationResult>;

    // Ranks & Customization
    getRankIds(): string[];
    hasRank(rankId: string): boolean;
    addRank(rankId: string): Promise<OperationResult>;
    removeRank(rankId: string): Promise<OperationResult>;
    getRank(): RankInfo;
    setRank(rankId: string): Promise<OperationResult>;
    getChatColor(): string;
    setChatColor(color: string): Promise<OperationResult>;

    // Island
    getIsland(): Promise<Island | null>
    getIslandName(): string;
    setIslandName(islandName: string): Promise<OperationResult>;
    isWorldIsland(): boolean;
    getWorldIsland(): Promise<Island | null>

    // Settings
    getSettings(): { [key in Setting]: string | boolean };
    getSetting(key: keyof typeof Setting): string | boolean | undefined
    setSetting(key: keyof typeof Setting, value: string | boolean): Promise<OperationResult>;
    hasSetting(key: string): boolean;
  }
}

class PlayerExtension {

  private static readonly NO_SESSION_RESULT: Promise<OperationResult> = Promise.resolve({ success: false, reason: "Player session not available." });


  public static setSession(player: Player, session: PlayerSession): void {
    player[sessionSymbol] = session;
  }

  public static getSession(player: Player): PlayerSession | null {
    return player[sessionSymbol] ?? null;
  }

  public static removeSession(player: Player): void {
    delete player[sessionSymbol];
  }

  public static async loadSession(player: Player): Promise<PlayerSession | null> {
    const session = await PlayerSession.load(player.xuid, PlayerDatabase.instance);
    if (session) {
      PlayerExtension.setSession(player, session);
    }
    return session;
  }

  public static async createSession(player: Player): Promise<PlayerSession> {
    const session = await PlayerSession.createDefault(player.xuid, player.username, PlayerDatabase.instance);
    PlayerExtension.setSession(player, session);
    return session;
  }
}

Player.prototype.session = function (this: Player): PlayerSession | null {
  return PlayerExtension.getSession(this);
};

Player.prototype.getTimePlayed = function (this: Player): number {
  const session = PlayerExtension.getSession(this);
  return session ? session.getTimePlayed() : 0;
};

Player.prototype.setTimePlayed = function (this: Player, value: number): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension["NO_SESSION_RESULT"]
  return session.setTimePlayed(value);
}

// Data
Player.prototype.getDataString = function (this: Player): string {
  const session = PlayerExtension.getSession(this);
  if (!session) return "";
  return session.getDataString();
}

Player.prototype.getDataProperty = function (this: Player, key: keyof PlayerData): any {
  const session = PlayerExtension.getSession(this);
  if (!session) return;
  return session.getDataProperty(key);
}

// Chat
Player.prototype.info = function (this: Player, message: string, source: ChatSource = ChatSource.server): void {
  this.sendMessage(`${source}§r ${message}`)
}

Player.prototype.warn = function (this: Player, message: string, source: ChatSource = ChatSource.server): void {
  this.sendMessage(`${source}§r §e[Warning] §6${message}`)
}

Player.prototype.error = function (this: Player, message: string, source: ChatSource = ChatSource.server): void {
  this.sendMessage(`${source}§r §4[Error] §c${message}`)
}

// Permissions
Player.prototype.getPermission = function (this: Player): PERMISSION_INTEGER {
  const session = PlayerExtension.getSession(this);
  return session ? session.getPermission() : PERMISSION_INTEGER.MEMBER;
}
Player.prototype.setPermission = async function (this: Player, permission: PERMISSION_INTEGER): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.setPermission(permission);
}

// Balance
Player.prototype.getMoney = function (this: Player): number {
  const session = PlayerExtension.getSession(this);
  return session ? session.getMoney() : 0;
}
Player.prototype.addMoney = async function (this: Player, amount: number): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.addMoney(amount);
}
Player.prototype.removeMoney = async function (this: Player, amount: number): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.removeMoney(amount);
}
Player.prototype.setMoney = async function (this: Player, amount: number): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.setMoney(amount);
}

Player.prototype.getXp = function (this: Player): number {
  const session = PlayerExtension.getSession(this);
  return session ? session.getXp() : 0;
}
Player.prototype.addXp = async function (this: Player, amount: number): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  if (amount <= 0) return { success: false, reason: "Amount must be a positive number." };
  this.addExperience(amount)
  return session.addXp(amount);
}
Player.prototype.removeXp = async function (this: Player, amount: number): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  if (amount <= 0) return { success: false, reason: "Amount must be a positive number." };
  if (this.getXp() < amount) return { success: false, reason: "Insufficient XP." };
  this.setExperience(this.getExperience() - amount)
  return session.removeXp(amount);
}
Player.prototype.setXp = async function (this: Player, amount: number): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.setXp(amount);
}

// Ranks & Customization
Player.prototype.getRankIds = function (this: Player): string[] {
  const session = PlayerExtension.getSession(this);
  return session ? session.getRankIds() : [];
}
Player.prototype.hasRank = function (this: Player, rankId: keyof typeof PlayerRank): boolean {
  const session = PlayerExtension.getSession(this);
  return session ? session.hasRank(rankId) : false;
}
Player.prototype.addRank = async function (this: Player, rankId: keyof typeof PlayerRank): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.addRank(rankId);
}
Player.prototype.removeRank = async function (this: Player, rankId: keyof typeof PlayerRank): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.removeRank(rankId);
}
Player.prototype.getRank = function (this: Player): RankInfo {
  const session = PlayerExtension.getSession(this);
  return session ? session.getRank() : RANKS.get("GUEST")!;
}
Player.prototype.setRank = async function (this: Player, rankId: keyof typeof PlayerRank): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.setRank(rankId);
}
Player.prototype.getChatColor = function (this: Player): string {
  const session = PlayerExtension.getSession(this);
  return session ? session.getChatColor() : "white";
}
Player.prototype.setChatColor = async function (this: Player, color: string): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.setChatColor(color);
}

// Island
Player.prototype.getIsland = async function (this: Player): Promise<Island | null> {
  const session = PlayerExtension.getSession(this)
  return session ? await session.getIsland() : null
}
Player.prototype.getIslandName = function (this: Player): string {
  const session = PlayerExtension.getSession(this);
  return session ? session.getIslandName() : "";
}
Player.prototype.setIslandName = async function (this: Player, islandName: string): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.setIslandName(islandName);
}
Player.prototype.isWorldIsland = function (this: Player): boolean {
  return this.world.identifier.startsWith("sb_")
}
Player.prototype.getWorldIsland = function (this: Player): Promise<Island | null> {
  return Island.load(this.world.identifier.substring(3))
}

// Settings
Player.prototype.getSettings = function (this: Player): { [key in Setting]: string | boolean } {
  const session = PlayerExtension.getSession(this);
  return session ? session.getSettings() : DEFAULT_PLAYER_DATA.settings;
}
Player.prototype.getSetting = function (this: Player, key: keyof typeof Setting): string | boolean | undefined {
  const session = PlayerExtension.getSession(this);
  return session ? session.getSetting(key as Setting) : undefined;
}
Player.prototype.setSetting = async function (this: Player, key: string, value: string | boolean): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.setSetting(key, value);
}
Player.prototype.hasSetting = function (this: Player, key: string): boolean {
  const session = PlayerExtension.getSession(this);
  return session ? session.hasSetting(key) : false;
}

export { PlayerExtension };