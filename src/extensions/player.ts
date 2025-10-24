
import { Player, PlayerCommandExecutorTrait } from "@serenityjs/core";
import { Island, PlayerDatabase, PlayerSession, PremiumDatabase, VanitySkin } from "../Classes";
import { OperationResult, PlayerData, PlayerStatCriteria, PremiumData, RankInfo, VanityInfo } from "../Types/types";
import { ChatSource, DEFAULT_PLAYER_DATA, DEFAULT_PREMIUM_DATA, PERMISSION_INTEGER } from "../Configuration/config";
import { PlayerRank, RANKS } from "../Configuration/Ranks/ranks";
import { Setting } from "../Configuration/Settings/settings";
import { PlayerInventory } from "./inventory";
import { AbilityIndex, DeviceOS, EquipmentSlot, Gamemode } from "@serenityjs/protocol";

const sessionSymbol = Symbol("player-session");

declare module "@serenityjs/core" {
  interface Player {
    [sessionSymbol]?: PlayerSession;
    session(): PlayerSession | null;

    getDevice(): string;

    updateUsername(): Promise<OperationResult>;
    getTimePlayed(): number
    setTimePlayed(value: number): Promise<OperationResult>
    getAllCriteria(): { [key in keyof PlayerStatCriteria]: number }
    getCriteria(stat: keyof PlayerStatCriteria): number
    incrementCriteria(stat: keyof PlayerStatCriteria, value?: number): Promise<OperationResult>
    decrementCriteria(stat: keyof PlayerStatCriteria, value?: number): Promise<OperationResult>
    updateCriteria(stat: keyof PlayerStatCriteria, value: number): Promise<OperationResult>

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
    hasRank(rankId: keyof typeof PlayerRank): boolean;
    addRank(rankId: keyof typeof PlayerRank): Promise<OperationResult>;
    removeRank(rankId: keyof typeof PlayerRank): Promise<OperationResult>;
    getPrimaryRank(): RankInfo;
    setPrimaryRank(rankId: keyof typeof PlayerRank): Promise<OperationResult>;
    getActiveRanks(): RankInfo[];
    getActiveRankIds(): string[];
    setActiveRanks(rankIds: (keyof typeof PlayerRank)[]): Promise<OperationResult>;
    pushActiveRank(rankId: keyof typeof PlayerRank): Promise<OperationResult>;
    popActiveRank(rankId: keyof typeof PlayerRank): Promise<OperationResult>;
    updateRanks(): void;
    getChatSize(): boolean;
    setChatSize(large: boolean): Promise<OperationResult>;
    getNameColor(): string;
    setNameColor(color: string): Promise<OperationResult>;
    getChatColor(): string;
    setChatColor(color: string): Promise<OperationResult>;
    getNickname(): string;
    setNickname(nickname: string): Promise<OperationResult>;

    // Slots
    getSlots(key: keyof PremiumData["slots"]): number;
    setSlots(key: keyof PremiumData["slots"], amount: number): Promise<OperationResult>;
    addSlots(key: keyof PremiumData["slots"], amount: number): Promise<OperationResult>;
    removeSlots(key: keyof PremiumData["slots"], amount: number): Promise<OperationResult>;

    // Vanity
    equipVanity(slot: 1 | 2 | 3, vanityId: string): void;
    unequipVanity(slot: 1 | 2 | 3): void;
    getVanity(slot: 1 | 2 | 3): VanityInfo | null;
    getEquippedVanity(): (VanityInfo | null)[];
    indexOfVanity(vanityId: string): 1 | 2 | 3 | -1;
    ownsVanity(vanityId: string): boolean;
    unlockVanity(vanityId: string): void;
    unlockAllVanity(): void;
    revokeVanity(vanityId: string): void;
    getOwnedVanity(): VanityInfo[];
    updateVanity(): void;

    // Island
    getIsland(): Island | null;
    getIslandAsync(): Promise<Island | null>
    getIslandName(): string;
    setIslandName(islandName: string): Promise<OperationResult>;
    isWorldIsland(): boolean;
    getWorldIsland(): Island | null;
    getWorldIslandAsync(): Promise<Island | null>
    getIslandsMemberOf(): string[];
    isMemberOfIsland(islandName: string): boolean;
    setMemberOfIsland(islandName: string): Promise<OperationResult>;
    unsetMemberOfIsland(islandName: string): Promise<OperationResult>;

    // Homes
    addHome(home: { name: string; location: { x: number; y: number; z: number; }, world: string }): Promise<OperationResult>;
    removeHome(name: string): Promise<OperationResult>;
    hasHome(name: string): boolean;
    getHomes(): { name: string; location: { x: number; y: number; z: number; }, world: string }[];

    // Settings
    getSettings(): { [key in Setting]: string | boolean };
    getSetting(key: keyof typeof Setting): string | boolean | undefined
    setSetting(key: keyof typeof Setting, value: string | boolean): Promise<OperationResult>;
    hasSetting(key: string): boolean;

    disableFlight(): void;

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
    const session = await PlayerSession.load(player.xuid, PlayerDatabase.instance, PremiumDatabase.instance);
    if (session) {
      PlayerExtension.setSession(player, session);
    }
    return session;
  }

  public static async createSession(player: Player): Promise<PlayerSession> {
    const session = await PlayerSession.createDefault(player.xuid, player.username, PlayerDatabase.instance, PremiumDatabase.instance);
    PlayerExtension.setSession(player, session);
    return session;
  }
}

Player.prototype.session = function (this: Player): PlayerSession | null {
  return PlayerExtension.getSession(this);
};

Player.prototype.getDevice = function (this: Player): string {
  const device = DeviceOS[this.clientSystemInfo.os];
  return device;
}

Player.prototype.updateUsername = async function (this: Player): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension["NO_SESSION_RESULT"]
  return session.updateUsername(this.username);
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

Player.prototype.getAllCriteria = function (this: Player): { [key in keyof PlayerStatCriteria]: number } {
  const session = PlayerExtension.getSession(this);
  return session ? session.getAllCriteria() : { ...DEFAULT_PLAYER_DATA.stats };
}

Player.prototype.getCriteria = function (this: Player, stat: keyof PlayerStatCriteria): number {
  const session = PlayerExtension.getSession(this);
  return session ? session.getCriteria(stat) : 0;
}

Player.prototype.incrementCriteria = function (this: Player, stat: keyof PlayerStatCriteria, value: number = 1): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension["NO_SESSION_RESULT"]
  return session.incrementCriteria(stat, value);
}

Player.prototype.decrementCriteria = function (this: Player, stat: keyof PlayerStatCriteria, value: number = 1): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension["NO_SESSION_RESULT"]
  return session.decrementCriteria(stat, value);
}

Player.prototype.updateCriteria = function (this: Player, stat: keyof PlayerStatCriteria, value: number): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension["NO_SESSION_RESULT"]
  return session.updateCriteria(stat, value);
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
  this.setExperience(amount);
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
  return session.addRank(rankId).then((result) => {
    if (result.success) {
      this.updateRanks();
    }
    return result;
  });
}
Player.prototype.removeRank = async function (this: Player, rankId: keyof typeof PlayerRank): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.removeRank(rankId).then((result) => {
    if (result.success) {
      this.updateRanks();
    }
    return result;
  });
}
Player.prototype.getPrimaryRank = function (this: Player): RankInfo {
  const session = PlayerExtension.getSession(this);
  return session ? session.getPrimaryRank() : RANKS.get("GUEST")!;
}
Player.prototype.setPrimaryRank = async function (this: Player, rankId: keyof typeof PlayerRank): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.setPrimaryRank(rankId).then((result) => {
    if (result.success) {
      this.updateRanks();
    }
    return result;
  });
}
Player.prototype.getActiveRanks = function (this: Player): RankInfo[] {
  const session = PlayerExtension.getSession(this);
  return session ? session.getActiveRanks() : [RANKS.get("GUEST")!];
}
Player.prototype.getActiveRankIds = function (this: Player): string[] {
  const session = PlayerExtension.getSession(this);
  return session ? session.getActiveRankIds() : [];
}
Player.prototype.setActiveRanks = async function (this: Player, rankIds: (keyof typeof PlayerRank)[]): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.setActiveRanks(rankIds).then((result) => {
    if (result.success) {
      this.updateRanks();
    }
    return result;
  });
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
Player.prototype.popActiveRank = async function (this: Player, rankId: keyof typeof PlayerRank): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.popActiveRank(rankId).then((result) => {
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
  // Send available commands.
  this.getTrait(PlayerCommandExecutorTrait).sendAvailableCommands();
  // Get primary rank.
  const primary = ranks[0]!;
  // Set name color.
  this.setNameColor(primary.nameColor);
  // Set chat color.
  this.setChatColor(primary.color);
  // Update slots.
  const slots = Object.entries(DEFAULT_PREMIUM_DATA.slots) as [keyof PremiumData["slots"], number][];
  for (const [slot, value] of slots) {
    this.setSlots(slot, value + (primary.slots[slot] || 0));
  }
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
Player.prototype.getNameColor = function (this: Player): string {
  const session = PlayerExtension.getSession(this);
  return session ? session.getNameColor() : "white";
}
Player.prototype.setNameColor = async function (this: Player, color: string): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.setNameColor(color);
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
Player.prototype.getNickname = function (this: Player): string {
  const session = PlayerExtension.getSession(this);
  return session ? session.getNickname() : "";
}
Player.prototype.setNickname = async function (this: Player, nickname: string): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.setNickname(nickname);
}

// Slots
Player.prototype.getSlots = function (this: Player, key: keyof PremiumData["slots"]): number {
  const session = PlayerExtension.getSession(this);
  if (!session) return 0;
  return session.getSlots(key);
}
Player.prototype.setSlots = async function (this: Player, key: keyof PremiumData["slots"], amount: number): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.setSlots(key, amount);
}

// Vanity
Player.prototype.equipVanity = function (this: Player, slot: 1 | 2 | 3, vanityId: string): void {
  const session = PlayerExtension.getSession(this);
  if (!session) return;
  session.equipVanity(slot, vanityId).then(() => {
    this.updateVanity();
  });
}
Player.prototype.unequipVanity = function (this: Player, slot: 1 | 2 | 3): void {
  const session = PlayerExtension.getSession(this);
  if (!session) return;
  session.unequipVanity(slot).then(() => {
    this.updateVanity();
  });
}
Player.prototype.getVanity = function (this: Player, slot: 1 | 2 | 3): VanityInfo | null {
  const session = PlayerExtension.getSession(this);
  if (!session) return null;
  return session.getVanity(slot);
}
Player.prototype.getEquippedVanity = function (this: Player): (VanityInfo | null)[] {
  const session = PlayerExtension.getSession(this);
  if (!session) return [];
  return session.getEquippedVanity();
}
Player.prototype.indexOfVanity = function (this: Player, vanityId: string): 1 | 2 | 3 | -1 {
  const session = PlayerExtension.getSession(this);
  if (!session) return -1;
  return session.indexOfVanity(vanityId);
}
Player.prototype.ownsVanity = function (this: Player, vanityId: string): boolean {
  const session = PlayerExtension.getSession(this);
  if (!session) return false;
  return session.ownsVanity(vanityId);
}
Player.prototype.unlockVanity = function (this: Player, vanityId: string): void {
  const session = PlayerExtension.getSession(this);
  if (!session) return;
  session.unlockVanity(vanityId);
}
Player.prototype.unlockAllVanity = function (this: Player): void {
  const session = PlayerExtension.getSession(this);
  if (!session) return;
  session.unlockAllVanity();
}
Player.prototype.revokeVanity = function (this: Player, vanityId: string): void {
  const session = PlayerExtension.getSession(this);
  if (!session) return;
  session.revokeVanity(vanityId).then(async (result) => {
    if (result.success) {
      if (this.getEquippedVanity().some((x) => x && x.id === vanityId)) {
        // Unequip the vanity.
        const slot = this.indexOfVanity(vanityId);
        this.unequipVanity(slot as 1 | 2 | 3);
        // Update the player's vanity.
        this.updateVanity();
      }
    }
  })
}
Player.prototype.getOwnedVanity = function (this: Player): VanityInfo[] {
  const session = PlayerExtension.getSession(this);
  if (!session) return [];
  return session.getOwnedVanity();
}
Player.prototype.updateVanity = function (this: Player): void {
  VanitySkin.create(this);
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
Player.prototype.getIslandsMemberOf = function (this: Player): string[] {
  const session = PlayerExtension.getSession(this);
  return session ? session.getIslandsMemberOf() : [];
}
Player.prototype.isMemberOfIsland = function (this: Player, islandName: string): boolean {
  const session = PlayerExtension.getSession(this);
  return session ? session.isMemberOfIsland(islandName) : false;
}
Player.prototype.setMemberOfIsland = async function (this: Player, islandName: string): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.setMemberOfIsland(islandName);
}
Player.prototype.unsetMemberOfIsland = async function (this: Player, islandName: string): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.unsetMemberOfIsland(islandName);
}

// Homes
Player.prototype.addHome = async function (this: Player, home: { name: string; location: { x: number; y: number; z: number; }, world: string }): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.addHome(home);
}
Player.prototype.removeHome = async function (this: Player, name: string): Promise<OperationResult> {
  const session = PlayerExtension.getSession(this);
  if (!session) return PlayerExtension['NO_SESSION_RESULT'];
  return session.removeHome(name);
}
Player.prototype.hasHome = function (this: Player, name: string): boolean {
  const session = PlayerExtension.getSession(this);
  if (!session) return false;
  const homes = session.getHomes();
  return homes.some((home) => home.name.toLowerCase() === name.toLowerCase());
}
Player.prototype.getHomes = function (this: Player): { name: string; location: { x: number; y: number; z: number; }, world: string }[] {
  const session = PlayerExtension.getSession(this);
  return session ? session.getHomes() : [];
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
Player.prototype.disableFlight = function (this: Player): void {
  const canFly = !this.abilities.getAbility(AbilityIndex.MayFly);
  if (canFly === false) {
    this.abilities.setAbility(AbilityIndex.MayFly, canFly);
    this.setGamemode(Gamemode.Adventure);
    setTimeout(() => {
      this.setGamemode(Gamemode.Survival);
    }, 1);
  }
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