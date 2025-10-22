enum WhitelistMode {
    /** Anyone can join */
    OPEN = "OPEN",
    /** No one can join. */
    CLOSED = "CLOSED",
    /** Only players on the allowlist can join. */
    ALLOW = "ALLOW",
    /** Only players with permission level or higher can join. */
    RESTRICTED = "RESTRICTED",
}

interface Whitelist {
    /** The current whitelist mode. */
    mode: WhitelistMode;
    properties: {
        /** A list of xuids of players who are allowed to join when the mode is ALLOW. */
        allowlist: string[];
        /** Minimum permission level required to join when the mode is RESTRICTED. */
        permissionLevel: number;
    };
}

export { Whitelist, WhitelistMode };