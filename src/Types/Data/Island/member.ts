import { PlayerInfo } from "../types";
import { IslandRole } from "./role";

interface IslandMember extends PlayerInfo {
  role: IslandRole
}

export { IslandMember }