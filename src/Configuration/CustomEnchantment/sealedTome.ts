import { EnchantmentRarity } from "../../Types/types";

class SealedTomeConfig {
    /** The cost of opening a sealed tome. */
    public static OPEN_COST(rarity: keyof typeof EnchantmentRarity): number {
        switch (rarity) {
            case "Common": return 5000;
            case "Rare": return 20000;
            case "Legendary": return 60000;
            case "Exotic": return 125000;
            default: return 0;
        }
    }
    /** The minimum random strength a tome can receive. */
    public static readonly MIN_STRENGTH: number = 2;
    /** The maximum random strength a tome can receive. */
    public static readonly MAX_STRENGTH: number = 100;
}

export { SealedTomeConfig }