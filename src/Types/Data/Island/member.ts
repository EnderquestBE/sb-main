import { IslandRole } from "./role";

interface IslandMember {
  xuid: string;
  username: string;
  role: IslandRole
}

export { IslandMember }