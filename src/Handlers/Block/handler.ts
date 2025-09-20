import {
    BlockIdentifier,
    EntityInventoryTrait,
    ItemStack,
    ItemStackEnchantableTrait,
    PlayerBreakBlockSignal,
    PlayerPlaceBlockSignal,
} from "@serenityjs/core";
import { BlockPointValues } from "../../Configuration/Point/point";
import { Utils } from "../../Utils/utils";
import { Enchantment, Gamemode } from "@serenityjs/protocol";
import { Logger, LoggerColors } from "@serenityjs/logger";
import { BlockOverrideMap } from "../../Configuration/Block/overrides";

type ValueOrRange = number | [number, number];

class BlockHandler {
    private static readonly logger = new Logger("Block Handler", LoggerColors.MaterialRedstone)

    // These blocks are ignored by the block handler.
    private static readonly exemptBlocks = new Set([
        BlockIdentifier.Beetroot,
        BlockIdentifier.Wheat,
        BlockIdentifier.Carrots,
        BlockIdentifier.Potatoes,
        BlockIdentifier.OakLeaves,
        BlockIdentifier.MobSpawner
    ])

    // Message to show if the player's inventory is full.
    private static readonly INV_FULL = "§cYour inventory is full!";

    // Cached fortune multiplier values.
    private static readonly fortunePool = new Map<number, number[]>();

    public static onBreak({ player, block, itemStack }: PlayerBreakBlockSignal): void {
        // If block has a custom implementation, return.
        if (this.exemptBlocks.has(block.identifier)) return;

        const island = player.getWorldIsland();
        if (!island) return;

        const info = BlockPointValues[block.identifier]?.break;
        if (!info) {
            if (player.gamemode === Gamemode.Survival) {
                try {
                    const id = BlockOverrideMap.get(block.identifier) ?? block.identifier
                    const item = new ItemStack(id, { stackSize: 1 });
                    const inventory = player.getTrait(EntityInventoryTrait);
                    if (!inventory.container.addItem(item)) {
                        player.info(this.INV_FULL);
                    }
                } catch (e: any) {
                    this.logger.warn(`§cFailed to add item: §b${block.identifier}\n§cTo player: §e${player.username}\n§r${e.message}`)
                }
            }
            return;
        }

        // Get item info.
        let itemId = info.item ?? block.identifier;
        let itemCount = info.amount ? Utils.randomInt(info.amount[0], info.amount[1]) : 1;

        // Handle island point data.
        if (info.points) {
            this._processRange(info.points, (val) => island.addPoints(val));
        }
        // Give player XP.
        if (info.xp) {
            const value = (this._processRange(info.xp, (val) => player.addXp(val)))
            if (value && player.getSetting("showXpOverlay")) player.onScreenDisplay.setActionBar(`§l§e>> §aCollected §d${value} §6XP §e<<§r`)
        }
        // Handle fortune enchantment if applicable.
        if (info.applyFortune) {
            if (itemStack) {
                const enchantable = itemStack.getTrait(ItemStackEnchantableTrait)
                if (enchantable) {
                    const fortuneLevel = enchantable.getEnchantment(Enchantment.Fortune)

                    if (fortuneLevel && fortuneLevel > 0) {
                        const multiplier = this.calculateFortuneMultiplier(fortuneLevel);
                        itemCount *= multiplier;
                    }
                }
            }
        }

        if (player.gamemode !== Gamemode.Survival) return

        if (itemCount <= 0) return;
        const item = new ItemStack(itemId, { stackSize: itemCount });
        const inventory = player.getTrait(EntityInventoryTrait);

        if (!inventory.container.addItem(item)) {
            player.info(this.INV_FULL);
        }
    }

    public static onPlace({ player, block }: PlayerPlaceBlockSignal): void {
        const island = player.getWorldIsland();
        if (!island) return;

        const points = BlockPointValues[block.identifier]?.place?.points;
        if (points) {
            island.addPoints(points);
        }
    }

    /**
     * @ HELPER FUNCTIONS
     */

    /**
     * Cache fortune pool values.
     */
    private static _cacheFortunePool(level: number) {
        const pool: number[] = [1, 1];
        for (let i = 2; i <= level + 1; i++) {
            pool.push(i);
        }
        this.fortunePool.set(level, pool);
    }

    /**
     * Process array type number ranges.
     */
    private static _processRange(value: ValueOrRange, addFunction: (amount: number) => void): number | null {
        if (typeof value === "number") {
            addFunction(value);
            return value
        } else {
            const randomValue = Utils.randomInt(value[0], value[1]);
            if (randomValue > 0) {
                addFunction(randomValue);
                return randomValue
            }
        }
        return null
    }

    /**
     * Calculates item multiplier from fortune level.
     */
    public static calculateFortuneMultiplier(level: number) {
        const pool = this.fortunePool.get(level)!
        const multiplier = pool[Utils.randomInt(0, pool.length - 1)]!
        return multiplier;
    }

    /**
     * Run on server start to initialize values.
     */
    public static initialize() {
        for (let i = 0; i < 10;) {
            this._cacheFortunePool(++i)
        }
    }
}

export { BlockHandler };