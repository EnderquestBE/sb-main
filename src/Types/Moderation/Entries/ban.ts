interface BanEntry {
    /** The unique identifier of the banned player. */
    xuid: string;
    /** The reason for the ban. */
    reason: string;
    /** The moderator who issued the ban. */
    moderator: string;
    /** The date the player was banned. */
    bannedDate: string;
    /** The date the player will be unbanned. */
    unbanDate: string;
    /** The duration of the ban in milliseconds. */
    duration: number;
}

export { BanEntry };