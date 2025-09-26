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
    position: new Vector3f(66.5, 65.5, -118.5),
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
    position: new Vector3f(63.5, 65.5, -125.5),
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
    position: new Vector3f(60.5, 65.5, -132.5),
    criteria: { name: "username", stat: "balance.xp" },
    format: (entry) => `§5${entry.rank}] §f${entry.name} §7- §d${entry.value}\n`
})