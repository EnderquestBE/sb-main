import { Vector3f } from "@serenityjs/protocol";
import { Document } from "mongodb";
import { IslandLimitType } from "./limitType";
import { IslandLimit } from "./limit";
import { IslandHome } from "./home";
import { BankLogEntry } from "./bankLogEntry";
import { PlayerInfo } from "../types";

interface IslandData extends Document {
  /**
   * The name of the island.
   */
  name: string;
  /**
   * User information for the owner of the island.
   */
  owner: PlayerInfo
  /**
   * User information for the founder of the island.
   */
  founder: PlayerInfo
  /**
   * The level of the island.
   */
  level: number;
  /**
   * The number of points the island current has.
   */
  points: number;
  /**
   * The highest level the island has ever reached, used for perks and such.
   */
  ceil: number;
  /**
   * The size radius of the island.
   */
  size: number;
  /**
   * The height limit of the island.
   */
  height: number;
  /**
   * The spawn location of the island.
   */
  spawn: Vector3f
  /**
   * The world the island is located in.
   */
  world: string
  /**
   * List of all island members.
   */
  members: PlayerInfo[];
  /**
   * List of island helpers.
   */
  helpers: PlayerInfo[];
  /**
   * List of island admins.
   */
  admins: PlayerInfo[];
  /**
   * List of island co-owners.
   */
  coowners: PlayerInfo[];
  /**
   * List of users that are banned from the island, format of XUIDs.
   */
  banned: string[];
  /**
   * The amount of coins stored in the island bank.
   */
  bank: number;
  /**
   * Logs for island bank transactions.
   */
  bankLogs: BankLogEntry[];
  /**
   * Island limit values.
   */
  limits: {
    [key in IslandLimitType]: IslandLimit
  };
  /**
   * All of the island homes available.
   */
  homes: IslandHome[];
  /**
   * Perk IDs that the island has unlocked.
   */
  perks: string[];
  /**
   * Permissions to grant to all members of the island while on the island.
   */
  commandPermissions: string[];
  /**
   * Whether or not the island is open to visitors.
   */
  status: boolean;
  /**
   * The preset that the island was generated with.
   */
  preset: string;
  /**
   * The date the island was created.
   */
  createdAt: Date;
  /**
   * The date this data instance was cached.
   */
  lastUpdated: Date
}

export { IslandData }