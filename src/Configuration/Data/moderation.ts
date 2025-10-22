import { GlobalServerData, WhitelistMode } from "../../Types/types";

/**
 * The default global server database configuration.
 */
const DEFAULT_SERVER_DATA: GlobalServerData = {
    activeBans: [],
    moderationHistory: {},
    whitelist: {
        mode: WhitelistMode.OPEN,
        properties: {
            allowlist: [],
            permissionLevel: 0,
        },
    },
    globalMultipliers: []
};

export { DEFAULT_SERVER_DATA };