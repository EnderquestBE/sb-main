import { Color, PremiumData } from "../types"

interface RankInfo {
    id: string // ID for the rank.
    name: string // Formatted name for the rank.
    displayName: string // Formatted + colored display name for the rank.
    nameColor: keyof typeof Color // The name color for username when this rank is active.
    color: keyof typeof Color // Color associated with rank for display purposes.
    permissions: string[] // Permission strings associated with rank.
    kits: string[] // IDs of the kits this rank can claim.
    slots: Partial<PremiumData["slots"]> // The extra slots permitted by this rank.
    description?: string; // Rank description for /helpme command.
}

export { RankInfo }