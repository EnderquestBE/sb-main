
import { Player } from "@serenityjs/core";
import { Island, PlayerDatabase, PlayerSession } from "../Classes";
import { OperationResult, PlayerData, RankInfo } from "../Types/types";
import { ChatSource, DEFAULT_PLAYER_DATA, PERMISSION_INTEGER } from "../Configuration/config";
import { PlayerRank, RANKS } from "../Configuration/Ranks/ranks";
import { Setting } from "../Configuration/Settings/settings";
import { PlayerInventory } from "./inventory";
import { EquipmentSlot } from "@serenityjs/protocol";

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
    info(message: string, source?: keyof typeof ChatSource): void
    warn(message: string, source?: keyof typeof ChatSource): void
    error(message: string, source?: keyof typeof ChatSource): void

    // Permissions
    getPermission(): PERMISSION_INTEGER;
    setPermission(permission: PERMISSION_INTEGER): Promise<OperationResult>;

    // Inventory
    get inventory(): PlayerInventory

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
    getPrimaryRank(): RankInfo;
    getActiveRanks(): RankInfo[];
    pushActiveRank(rankId: string): Promise<OperationResult>;
    popActiveRank(): Promise<OperationResult>;
    updateRanks(): void;
    getChatSize(): boolean;
    setChatSize(large: boolean): Promise<OperationResult>;
    getChatColor(): string;
    setChatColor(color: string): Promise<OperationResult>;

    // Island
    getIsland(): Island | null;
    getIslandAsync(): Promise<Island | null>
    getIslandName(): string;
    setIslandName(islandName: string): Promise<OperationResult>;
    isWorldIsland(): boolean;
    getWorldIsland(): Island | null;
    getWorldIslandAsync(): Promise<Island | null>

    // Settings
    getSettings(): { [key in Setting]: string | boolean };
    getSetting(key: keyof typeof Setting): string | boolean | undefined
    setSetting(key: keyof typeof Setting, value: string | boolean): Promise<OperationResult>;
    hasSetting(key: string): boolean;

    // While Equipped Check
    whileEquippedCheck: { [key in EquipmentSlot]: NodeJS.Timeout | null }
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
Player.prototype.info = function (this: Player, message: string, source: keyof typeof ChatSource = "server"): void {
  this.sendMessage(`${ChatSource[source]}§r ${message}`)
}

Player.prototype.warn = function (this: Player, message: string, source: keyof typeof ChatSource = "server"): void {
  this.sendMessage(`${ChatSource[source]}§r §e[Warning] §6${message}`)
}

Player.prototype.error = function (this: Player, message: string, source: keyof typeof ChatSource = "server"): void {
  this.sendMessage(`${ChatSource[source]}§r §4[Error] §c${message}`)
}

// Inventory
Object.defineProperty(Player.prototype, "inventory", {
  get: function (this: Player): PlayerInventory {
    return new PlayerInventory(this);
  },
});

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
  //@ts-ignore
  this.removeExperience(amount)
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
Player.prototype.getPrimaryRank = function (this: Player): RankInfo {
  const session = PlayerExtension.getSession(this);
  return session ? session.getPrimaryRank() : RANKS.get("GUEST")!;
}
Player.prototype.getActiveRanks = function (this: Player): RankInfo[] {
  const session = PlayerExtension.getSession(this);
  return session ? session.getActiveRanks() : [RANKS.get("GUEST")!];
}
Player.prototype.pushActiveRank = async function (this: Player, rankId: keyof typeof PlayerRank): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.pushActiveRank(rankId).then((result) => {
    if (result.success) {
      this.updateRanks();
    }
    return result;
  });
}
Player.prototype.popActiveRank = async function (this: Player): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.popActiveRank().then((result) => {
    if (result.success) {
      this.updateRanks();
    }
    return result;
  })
}
Player.prototype.updateRanks = function (this: Player): void {
  const session = PlayerExtension.getSession(this);
  if (!session) return
  const ranks = session.getActiveRanks()
  if (ranks.length === 0) return;

  // Update rank permissions.
  const newPermissions = this.permissions.permissions.filter((x) => !x.startsWith("rank."))
  for (const rank of ranks) {
    newPermissions.push(...rank.permissions)
  }
  this.permissions.permissions = newPermissions
  // Set chat color.
  this.setChatColor(ranks[0]!.color)
}
Player.prototype.getChatSize = function (this: Player): boolean {
  const session = PlayerExtension.getSession(this);
  return session ? session.getChatSize() : DEFAULT_PLAYER_DATA.chatSize
}
Player.prototype.setChatSize = async function (this: Player, large: boolean): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.setChatSize(large);
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
Player.prototype.getIsland = function (this: Player): Island | null {
  const session = PlayerExtension.getSession(this)
  return session ? session.getIsland() : null
}
Player.prototype.getIslandAsync = async function (this: Player): Promise<Island | null> {
  const session = PlayerExtension.getSession(this)
  return session ? await session.getIslandAsync() : null
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
Player.prototype.getWorldIsland = function (this: Player): Island | null {
  if (!this.isWorldIsland()) return null;
  const islandName = this.world.identifier.substring(3);
  return Island.loadSync(islandName);
}
Player.prototype.getWorldIslandAsync = function (this: Player): Promise<Island | null> {
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

// While Equipped Check
const whileEquippedCheckSymbol = Symbol("whileEquippedCheck");

Object.defineProperty(Player.prototype, "whileEquippedCheck", {
  get: function (this: Player & { [whileEquippedCheckSymbol]?: any }) {
    if (!this[whileEquippedCheckSymbol]) {
      this[whileEquippedCheckSymbol] = {
        [EquipmentSlot.Head]: null,
        [EquipmentSlot.Chest]: null,
        [EquipmentSlot.Legs]: null,
        [EquipmentSlot.Feet]: null,
      }
    }
    return this[whileEquippedCheckSymbol];
  },
  set: function (this: Player & { [whileEquippedCheckSymbol]?: any }, value) {
    this[whileEquippedCheckSymbol] = value;
  }
});

export { PlayerExtension };