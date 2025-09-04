interface PlayerData {
  xuid: string; // The player's xbox user id.
  username: string; // The player's gamertag/username.
  balances: {
    coins: number;
    xp: number;
    shards: number;
  };
  islandUuid?: string; // The UUID of the island they own, if any
  firstJoin: Date;
  lastSeen: Date;
  permissions: string[]; // List of permission nodes or roles
  // Add other player-specific fields here as needed
}

export { PlayerData }