import { RankInfo } from "../../Types/types"

enum PlayerRank {
    /* Standard Ranks */
    GUEST = "GUEST",
    /* Premium Ranks */
    NOMAD = "NOMAD",
    ELITE = "ELITE",
    LEGEND = "LEGEND",
    MASTER = "MASTER",
    TITAN = "TITAN",
    IMMORTAL = "IMMORTAL",
    CELESTIAL = "CELESTIAL",
    /* Exclusive Ranks */
    YOUTUBER = "YOUTUBER",
    /* Staff Ranks */
    TRAINEE = "TRAINEE",
    HELPER = "HELPER",
    BUILDER = "BUILDER",
    MODERATOR = "MODERATOR",
    SRMODERATOR = "SRMODERATOR",
    ADMIN = "ADMIN",
    SRADMIN = "SRADMIN",
    MANAGER = "MANAGER",
    OWNER = "OWNER",
}


const RANKS = new Map<keyof typeof PlayerRank, RankInfo>([
    /**
     * Standard Ranks
     */
    [
        PlayerRank.GUEST,
        {
            id: PlayerRank.GUEST,
            name: "Guest",
            displayName: "§fGuest",
            nameColor: "Green",
            color: "White",
            permissions: [],
            kits: []
        }
    ],
    /**
     * Premium Ranks
     */
    [
        PlayerRank.NOMAD,
        {
            id: PlayerRank.NOMAD,
            name: "Nomad",
            displayName: "§aNomad",
            nameColor: "Green",
            color: "Green",
            permissions: ["rank.fly", "rank.sellall", "rank.sellallxp"],
            kits: []
        }
    ],
    [
        PlayerRank.ELITE,
        {
            id: PlayerRank.ELITE,
            name: "Elite",
            displayName: "§bElite",
            nameColor: "Green",
            color: "Green",
            permissions: ["rank.fly", "rank.sellall", "rank.sellallxp", "rank.repair", "rank.compressall"],
            kits: []
        }
    ],
    [
        PlayerRank.LEGEND,
        {
            id: PlayerRank.LEGEND,
            name: "Legend",
            nameColor: "Green",
            displayName: "§6Legend",
            color: "Green",
            permissions: ["rank.fly", "rank.sellall", "rank.sellallxp", "rank.repair", "rank.compressall", "rank.feed", "rank.time"],
            kits: []
        }
    ],
    [
        PlayerRank.MASTER,
        {
            id: PlayerRank.MASTER,
            name: "Master",
            displayName: "§9Master",
            nameColor: "Green",
            color: "Aqua",
            permissions: ["rank.fly", "rank.sellall", "rank.sellallxp", "rank.repair", "rank.compressall", "rank.feed", "rank.time", "rank.weather", "rank.rename"],
            kits: []
        }
    ],
    [
        PlayerRank.TITAN,
        {
            id: PlayerRank.TITAN,
            name: "Titan",
            displayName: "§l§cTitan§r",
            nameColor: "Green",
            color: "Aqua",
            permissions: ["rank.fly", "rank.sellall", "rank.sellallxp", "rank.repair", "rank.compressall", "rank.feed", "rank.time", "rank.weather", "rank.rename", "rank.party", "rank.sethome"],
            kits: []
        }
    ],
    [
        PlayerRank.IMMORTAL,
        {
            id: PlayerRank.IMMORTAL,
            name: "Immortal",
            displayName: "§6||§l§eImmortal§r§6||",
            nameColor: "Green",
            color: "Aqua",
            permissions: ["rank.fly", "rank.sellall", "rank.sellallxp", "rank.repair", "rank.compressall", "rank.feed", "rank.time", "rank.weather", "rank.rename", "rank.party", "rank.sethome", "rank.nickname", "rank.chatsize"],
            kits: []
        }
    ],
    [
        PlayerRank.CELESTIAL,
        {
            id: PlayerRank.CELESTIAL,
            name: "Celestial",
            displayName: "§b||§l§dCel§best§eial§r§b||",
            nameColor: "LightPurple",
            color: "Aqua",
            permissions: ["rank.fly", "rank.sellall", "rank.sellallxp", "rank.repair", "rank.compressall", "rank.feed", "rank.time", "rank.weather", "rank.rename", "rank.party", "rank.sethome", "rank.nickname", "rank.chatsize", "rank.rainbow"],
            kits: []
        }
    ],
    /**
     * Exclusive Ranks
     */
    [
        PlayerRank.YOUTUBER,
        {
            id: PlayerRank.YOUTUBER,
            name: "YouTuber",
            displayName: "§cYou§fTuber",
            nameColor: "Green",
            color: "White",
            permissions: ["rank.fly", "rank.sellall", "rank.sellallxp"],
            kits: []
        }
    ],
    /**
     * Staff Ranks
     */
    [
        PlayerRank.TRAINEE,
        {
            id: PlayerRank.TRAINEE,
            name: "Trainee",
            displayName: "§eTrainee",
            nameColor: "White",
            color: "Yellow",
            permissions: [],
            kits: []
        }
    ],
    [
        PlayerRank.HELPER,
        {
            id: PlayerRank.HELPER,
            name: "Helper",
            displayName: "§bHelper",
            nameColor: "White",
            color: "Yellow",
            permissions: ["rank.chatsize"],
            kits: []
        }
    ],
    [
        PlayerRank.BUILDER,
        {
            id: PlayerRank.BUILDER,
            name: "Builder",
            displayName: "§3Builder",
            nameColor: "White",
            color: "Green",
            permissions: [],
            kits: []
        }
    ],
    [
        PlayerRank.MODERATOR,
        {
            id: PlayerRank.MODERATOR,
            name: "Mod",
            displayName: "§l§aMod§r",
            nameColor: "White",
            color: "Yellow",
            permissions: ["rank.chatsize"],
            kits: []
        }
    ],
    [
        PlayerRank.SRMODERATOR,
        {
            id: PlayerRank.SRMODERATOR,
            name: "Sr.Mod",
            displayName: "§l§2Sr.Mod§r",
            nameColor: "White",
            color: "Yellow",
            permissions: ["rank.chatsize"],
            kits: []
        }
    ],
    [
        PlayerRank.ADMIN,
        {
            id: PlayerRank.ADMIN,
            name: "Admin",
            displayName: "§l§5Admin§r",
            nameColor: "White",
            color: "Yellow",
            permissions: ["rank.chatsize"],
            kits: []
        }
    ],
    [
        PlayerRank.SRADMIN,
        {
            id: PlayerRank.SRADMIN,
            name: "Sr.Admin",
            displayName: "§l§1Sr.Admin§r",
            nameColor: "White",
            color: "Yellow",
            permissions: ["rank.chatsize"],
            kits: []
        }
    ],
    [
        PlayerRank.MANAGER,
        {
            id: PlayerRank.MANAGER,
            name: "Manager",
            displayName: "§l§cManager§r",
            nameColor: "White",
            color: "Yellow",
            permissions: ["rank.chatsize"],
            kits: []
        }
    ],
    [
        PlayerRank.OWNER,
        {
            id: PlayerRank.OWNER,
            name: "Owner",
            displayName: "§l§6Owner§r",
            nameColor: "Yellow",
            color: "Yellow",
            permissions: ["rank.chatsize"],
            kits: []
        }
    ]
])

export { RANKS, PlayerRank }