import { PERMISSION_INTEGER, PlayerRank } from "../../../Configuration/config";
import { Setting } from "../../../Configuration/Settings/settings";
import { PlayerStatCriteria } from "./stats";

interface PlayerData {
  /**
   * Xbox user ID of the player.
   */
  xuid: string;
  /**
   * Gamertag/username of the player.
   */
  username: string;
  /**
   * Highest player permission level.
   */
  permission: PERMISSION_INTEGER;
  /**
   * Currency balance values for the player.
   */
  balance: {
    money: number;
    xp: number;
  }
  /**
   * List of rank IDs that a player owns.
   */
  ranks: (keyof typeof PlayerRank)[]
  /**
   * The ranks the player is currently using.
   */
  activeRanks: (keyof typeof PlayerRank)[]
  /**
   * The chat color the player is currently using.
   */
  chatColor: string
  /**
   * The size of the player's chat messages.
   */
  chatSize: boolean
  /**
   * The island name the player currently belongs to.
   */
  island: string
  /**
   * List of islands the player is a member of.
   */
  memberOf: string[];
  /**
   * User setting values to remember for the player.
   */
  settings: { [key in Setting]: string | boolean };
  /**
   * The amount of time in seconds the user has spent on the server.
   */
  timePlayed: number
  /**
   * Criteria-based stats.
   */
  stats: PlayerStatCriteria;
  /**
   * The date the player was last seen online.
   */
  lastSeen: Date;
  /**
   * The date the player was first seen on the server.
   */
  firstSeen: Date;
  /**
   * The date this data instance was cached.
   */
  lastUpdated: Date;
}

export { PlayerData };
