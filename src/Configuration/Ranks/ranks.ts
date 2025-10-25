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
            kits: ["starter", "weekly"],
            slots: {},
            description: "The default rank for all players."
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
            kits: ["starter", "weekly", "nomad"],
            slots: {
                auction: 2,
                membership: 2
            },
            description: "The mark of a kind soul who supported this server!"
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
            kits: ["starter", "weekly", "nomad", "elite"],
            slots: {
                auction: 2,
                membership: 2
            },
            description: "They know what they're doing."
        },
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
            kits: ["starter", "weekly", "nomad", "elite", "legend"],
            slots: {
                auction: 2,
                membership: 2
            },
            description: "You absolute legend."
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
            kits: ["starter", "weekly", "nomad", "elite", "legend", "master"],
            slots: {
                auction: 3,
                membership: 3
            },
            description: "A true master of the craft."
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
            permissions: ["rank.fly", "rank.sellall", "rank.sellallxp", "rank.repair", "rank.compressall", "rank.feed", "rank.time", "rank.weather", "rank.rename", "rank.party", "rank.home"],
            kits: ["starter", "weekly", "nomad", "elite", "legend", "master", "titan"],
            slots: {
                homes: 3,
                auction: 4,
                membership: 4
            },
            description: "A titan among mortals, standing tall and unyielding."
        }
    ],
    [
        PlayerRank.IMMORTAL,
        {
            id: PlayerRank.IMMORTAL,
            name: "Immortal",
            displayName: "§6§l||§eImmortal§6||§r",
            nameColor: "Green",
            color: "Aqua",
            permissions: ["rank.fly", "rank.sellall", "rank.sellallxp", "rank.repair", "rank.compressall", "rank.feed", "rank.time", "rank.weather", "rank.rename", "rank.party", "rank.home", "rank.nickname", "rank.chatsize"],
            kits: ["starter", "weekly", "nomad", "elite", "legend", "master", "titan", "immortal"],
            slots: {
                homes: 4,
                auction: 5,
                membership: 5
            },
            description: "Larger than life, transcending our expectations."
        }
    ],
    [
        PlayerRank.CELESTIAL,
        {
            id: PlayerRank.CELESTIAL,
            name: "Celestial",
            displayName: "§b§l||§dCel§best§eial§b||§r",
            nameColor: "LightPurple",
            color: "Aqua",
            permissions: ["rank.fly", "rank.sellall", "rank.sellallxp", "rank.repair", "rank.compressall", "rank.feed", "rank.time", "rank.weather", "rank.rename", "rank.party", "rank.home", "rank.nickname", "rank.chatsize", "rank.rainbow"],
            kits: ["starter", "weekly", "nomad", "elite", "legend", "master", "titan", "immortal", "celestial"],
            slots: {
                homes: 5,
                auction: 7,
                membership: 7
            },
            description: "Radiates the ethereal power of super generousity!"
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
            kits: ["starter", "weekly", "youtuber"],
            slots: {},
            description: "An exclusive rank for content creators obtained through application."
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
            kits: [],
            slots: {}
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
            kits: [],
            slots: {}
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
            kits: [],
            slots: {}
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
            kits: [],
            slots: {}
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
            kits: [],
            slots: {}
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
            kits: [],
            slots: {}
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
            kits: [],
            slots: {}
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
            kits: [],
            slots: {}
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
            kits: [],
            slots: {}
        }
    ]
])

export { RANKS, PlayerRank }