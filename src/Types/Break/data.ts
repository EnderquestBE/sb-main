interface BreakData {
    item?: string; // Item ID to drop from this block. If undefined, uses the block.
    amount?: [number, number] // Amount range to drop of the item. If undefined, uses 1.
    points?: number | [number, number]; // Island points to be given on break.
    xp?: number | [number, number]; // XP to be given on break.
}

interface PlaceData {
    points?: number // Island points to be given when placed.
}

interface BlockBreak {
    break?: BreakData
    place?: PlaceData
}

export { BlockBreak };