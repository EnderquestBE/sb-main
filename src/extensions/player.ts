
import { Player } from "@serenityjs/core";
import { PlayerSession } from "../Classes/Data/PlayerSession";
import { PlayerDatabase } from "../Classes/Database/Collections/Player";
import { OperationResult } from "../Types/types";
import { ChatSource, PERMISSION_INTEGER } from "../Configuration/config";
import { Island } from "../Classes/Data/Island";

const sessionSymbol = Symbol("player-session");

declare module "@serenityjs/core" {
  interface Player {
    [sessionSymbol]?: PlayerSession;
    session(): PlayerSession | null;

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
    getShards(): number;
    addShards(amount: number): Promise<OperationResult>;
    removeShards(amount: number): Promise<OperationResult>;
    setShards(amount: number): Promise<OperationResult>;

    // Ranks & Customization
    getRanks(): string[];
    hasRank(rankId: string): boolean;
    addRank(rankId: string): Promise<OperationResult>;
    removeRank(rankId: string): Promise<OperationResult>;
    getRank(): string;
    setRank(rankId: string): Promise<OperationResult>;
    getChatColor(): string;
    setChatColor(color: string): Promise<OperationResult>;

    // Island
    getIsland(): Promise<Island | null>
    getIslandUUID(): string;
    setIslandUUID(islandUuid: string): Promise<OperationResult>;

    // Settings
    getSettings(): { [key: string]: string | boolean };
    getSetting(key: string): string | boolean | undefined
    setSetting(key: string, value: string | boolean): Promise<OperationResult>;
    removeSetting(key: string): Promise<OperationResult>;
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
  return session.addXp(amount);
}
Player.prototype.removeXp = async function (this: Player, amount: number): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.removeXp(amount);
}
Player.prototype.setXp = async function (this: Player, amount: number): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.setXp(amount);
}

Player.prototype.getShards = function (this: Player): number {
  const session = PlayerExtension.getSession(this);
  return session ? session.getShards() : 0;
}
Player.prototype.addShards = async function (this: Player, amount: number): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.addShards(amount);
}
Player.prototype.removeShards = async function (this: Player, amount: number): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.removeShards(amount);
}
Player.prototype.setShards = async function (this: Player, amount: number): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.setShards(amount);
}

// Ranks & Customization
Player.prototype.getRanks = function (this: Player): string[] {
  const session = PlayerExtension.getSession(this);
  return session ? session.getRanks() : [];
}
Player.prototype.hasRank = function (this: Player, rankId: string): boolean {
  const session = PlayerExtension.getSession(this);
  return session ? session.hasRank(rankId) : false;
}
Player.prototype.addRank = async function (this: Player, rankId: string): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.addRank(rankId);
}
Player.prototype.removeRank = async function (this: Player, rankId: string): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.removeRank(rankId);
}
Player.prototype.getRank = function (this: Player): string {
  const session = PlayerExtension.getSession(this);
  return session ? session.getRank() : "default";
}
Player.prototype.setRank = async function (this: Player, rankId: string): Promise<OperationResult> {
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
Player.prototype.getIslandUUID = function (this: Player): string {
  const session = PlayerExtension.getSession(this);
  return session ? session.getIslandUUID() : "";
}
Player.prototype.setIslandUUID = async function (this: Player, islandUuid: string): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.setIslandUUID(islandUuid);
}

// Settings
Player.prototype.getSettings = function (this: Player): { [key: string]: string | boolean } {
  const session = PlayerExtension.getSession(this);
  return session ? session.getSettings() : {};
}
Player.prototype.getSetting = function (this: Player, key: string): string | boolean | undefined {
  const session = PlayerExtension.getSession(this);
  return session ? session.getSetting(key) : undefined;
}
Player.prototype.setSetting = async function (this: Player, key: string, value: string | boolean): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.setSetting(key, value);
}
Player.prototype.removeSetting = async function (this: Player, key: string): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.removeSetting(key);
}
Player.prototype.hasSetting = function (this: Player, key: string): boolean {
  const session = PlayerExtension.getSession(this);
  return session ? session.hasSetting(key) : false;
}

export { PlayerExtension };