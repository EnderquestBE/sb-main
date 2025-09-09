import { PERMISSION_INTEGER, PlayerRank } from "../../../Configuration/config";
import { Setting } from "../../../Configuration/Settings/settings";

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
   * The rank the player is currently using.
   */
  rank: keyof typeof PlayerRank
  /**
   * The chat color the player is currently using.
   */
  chatColor: string
  /**
   * The island UUID the player currently belongs to.
   */
  island: string
  /**
   * User setting values to remember for the player.
   */
  settings: { [key in Setting]: string | boolean };
  /**
   * The amount of time in seconds the user has spent on the server.
   */
  timePlayed: number
  /**
   * The date the player was last seen online.
   */
  lastSeen: Date;
  /**
   * The date this data instance was cached.
   */
  lastUpdated: Date;
}

export { PlayerData };
