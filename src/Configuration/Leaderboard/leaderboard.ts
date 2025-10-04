import { Vector3f } from "@serenityjs/protocol";
import { LeaderboardHandler } from "../../Handlers/Leaderboard/handler";
import { Color } from "../../Types/types";
import { Utils } from "../../Utils/utils";

// Top Islands
LeaderboardHandler.register({
    id: "top_islands",
    name: "Top Islands",
    primary: Color.Green,
    secondary: Color.Green,
    collection: "island",
    position: new Vector3f(0.5, 69.5, 28.5),
    criteria: { name: "name", stat: "level" },
    format: (entry) => `§a${entry.rank}] §b${entry.name} §7- §3${entry.value}\n`
})

// Top Money
LeaderboardHandler.register({
    id: "top_money",
    name: "Top Money",
    primary: Color.Yellow,
    secondary: Color.Yellow,
    collection: "player",
    position: new Vector3f(11.5, 69.5, 29.5),
    criteria: { name: "username", stat: "balance.money" },
    format: (entry) => `§e${entry.rank}] §f${entry.name} §7- §6$${Utils.formatInt(entry.value)}\n`
})

// Top XP
LeaderboardHandler.register({
    id: "top_xp",
    name: "Top XP",
    primary: Color.LightPurple,
    secondary: Color.LightPurple,
    collection: "player",
    position: new Vector3f(-10.5, 69.5, 29.5),
    criteria: { name: "username", stat: "balance.xp" },
    format: (entry) => `§5${entry.rank}] §f${entry.name} §7- §d${entry.value}\n`
})

// Time Played
LeaderboardHandler.register({
    id: "top_time_played",
    name: "Top Time Played",
    primary: Color.Yellow,
    secondary: Color.Yellow,
    collection: "player",
    position: new Vector3f(0.5, 67.5, -64.5),
    criteria: { name: "username", stat: "timePlayed" },
    format: (entry) => `§b${entry.rank}] §f${entry.name} §7- §b${Utils.formatDuration(entry.value)}\n`
})

/* CRITERIA-BASED LEADERBOARDS */

// Top Blocks Mined
LeaderboardHandler.register({
    id: "top_blocks_mined",
    name: "Top Blocks Mined",
    primary: Color.Aqua,
    secondary: Color.Red,
    collection: "player",
    position: new Vector3f(66.5, 65.5, -118.5),
    criteria: { name: "username", stat: "stats.blocksMined" },
    format: (entry) => `§c${entry.rank}] §f${entry.name} §7- §d${entry.value}\n`
})

// Top Blocks Placed
LeaderboardHandler.register({
    id: "top_blocks_placed",
    name: "Top Blocks Placed",
    primary: Color.Green,
    secondary: Color.Red,
    collection: "player",
    position: new Vector3f(63.5, 65.5, -125.5),
    criteria: { name: "username", stat: "stats.blocksPlaced" },
    format: (entry) => `§c${entry.rank}] §f${entry.name} §7- §d${entry.value}\n`
})

// Top Crops Farmed
LeaderboardHandler.register({
    id: "top_crops_farmed",
    name: "Top Crops Farmed",
    primary: Color.Yellow,
    secondary: Color.Red,
    collection: "player",
    position: new Vector3f(60.5, 65.5, -132.5),
    criteria: { name: "username", stat: "stats.cropsFarmed" },
    format: (entry) => `§c${entry.rank}] §f${entry.name} §7- §d${entry.value}\n`
})