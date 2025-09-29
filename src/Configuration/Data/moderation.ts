import { ModerationData, WhitelistMode } from "../../Types/types";

/**
 * The default moderation database configuration.
 */
const DEFAULT_MODERATION_DATA: ModerationData = {
    activeBans: [],
    moderationHistory: {},
    whitelist: {
        mode: WhitelistMode.OPEN,
        properties: {
            allowlist: [],
            permissionLevel: 0,
        },
    },
};

export { DEFAULT_MODERATION_DATA }