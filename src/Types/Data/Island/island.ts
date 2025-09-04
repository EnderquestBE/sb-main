import { Vector3f } from "@serenityjs/protocol";
import { Document } from "mongodb";
import { IslandMember } from "./member";
import { IslandLimitType } from "./limitType";
import { IslandLimit } from "./limit";
import { IslandHome } from "./home";
import { BankLogEntry } from "./bankLogEntry";

interface IslandData extends Document {
  /**
   * The unique identifier belonging to this island.
   */
  uuid: string;
  /**
   * The XUID of the owner of the island.
   */
  owner: string;
  /**
   * The XUID of the founder of the island.
   */
  founder: string;
  /**
   * The name of the island.
   */
  name: string;
  /**
   * The level of the island.
   */
  level: number;
  /**
   * The number of points the island current has.
   */
  points: number;
  /**
   * The size radius of the island.
   */
  size: number;
  /**
   * The spawn location of the island.
   */
  spawn: Vector3f
  /**
   * The dimension the island is located in.
   */
  dimension: string
  /**
   * List of island members.
   */
  members: IslandMember[];
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
    [key in IslandLimitType]?: IslandLimit
  };
  /**
   * All of the island homes available.
   */
  homes: IslandHome[];
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
}

export { IslandData }