import { PERMISSION_INTEGER } from "../../../Configuration/config";
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
   * The name color the player is currently using.
   */
  nameColor: string
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
   * The vanity items the player has equipped.
   */
  equippedVanity: {
    1: string | null; // Vanity item ID for slot 1
    2: string | null; // Vanity item ID for slot 2
    3: string | null; // Vanity item ID for slot 3
  };
  /**
   * The global home locations the player has set.
   */
  homes: {
    name: string;
    location: {
      x: number;
      y: number;
      z: number;
    };
    world: string;
  }[];
  /**
   * Nickname that shows up instead of username for nametag if set.
   */
  nickname: string;
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
