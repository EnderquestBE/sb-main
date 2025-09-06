import { PERMISSION_INTEGER } from "../../../Configuration/config";

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
    shards: number;
  }
  /**
   * List of rank IDs that a player owns.
   */
  ranks: string[]
  /**
   * The rank the player is currently using.
   */
  rank: string
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
  settings: { [key: string]: string | boolean };
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
