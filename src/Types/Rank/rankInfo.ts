import { Color } from "../types"

interface RankInfo {
    id: string // ID for the rank.
    name: string // Formatted name for the rank.
    displayName: string // Formatted + colored display name for the rank.
    color: keyof typeof Color // Color associated with rank for display purposes.
    permissions: string[] // Permission strings associated with rank.
    kits: string[] // IDs of the kits this rank can claim.
}

export { RankInfo }