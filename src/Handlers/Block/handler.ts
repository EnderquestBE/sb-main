import {
    Block,
    BlockIdentifier,
    EntityInventoryTrait,
    ItemIdentifier,
    ItemStack,
    ItemStackEnchantableTrait,
    Player,
    PlayerHungerTrait,
    PlayerPlaceBlockSignal,
} from "@serenityjs/core";
import { BlockPointValues } from "../../Configuration/Point/point";
import { Utils } from "../../Utils/utils";
import { Enchantment, Gamemode } from "@serenityjs/protocol";
import { Logger, LoggerColors } from "@serenityjs/logger";
import { BlockOverrideMap } from "../../Configuration/Block/overrides";
import { StashHandler } from "../Stash/handler";

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

    private static readonly smelted = new Map<string, ItemIdentifier>([
        [BlockIdentifier.IronOre, ItemIdentifier.IronIngot],
        [BlockIdentifier.GoldOre, ItemIdentifier.GoldIngot]
    ])

    private static cropBlocks = new Set([
        BlockIdentifier.Pumpkin,
        BlockIdentifier.MelonBlock
    ])

    // Message to show if the player's inventory is full.
    private static readonly INV_FULL = "§cYour inventory is full!";

    // Cached fortune multiplier values.
    private static readonly fortunePool = new Map<number, number[]>();

    public static onBreak(player: Player, itemStack: ItemStack | null, ...blocks: Block[]): void {
        const island = player.getWorldIsland();
        if (!island) return;
        if (blocks.some((x) => this.cropBlocks.has(x.identifier))) player.incrementCriteria("cropsFarmed", 1);
        else player.incrementCriteria("blocksMined", 1);

        for (const block of blocks) {
            // If block has a custom implementation, return.
            if (this.exemptBlocks.has(block.identifier)) continue;

            // Handle exhaustion.
            const hunger = player.getTrait(PlayerHungerTrait)
            if (hunger) hunger.exhaustion += 0.05;

            const info = BlockPointValues[block.identifier]?.break;
            if (!info) {
                if (player.getGamemode() === Gamemode.Survival) {
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
                continue;
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

            let stashChance = info.stashChance ?? 1;

            // Handle fortune enchantment if applicable.
            if (itemStack) {
                const enchantmentResults = this.handleEnchantments(itemStack, block, itemId, itemCount, stashChance);
                itemId = enchantmentResults.itemId;
                itemCount = enchantmentResults.count;
                stashChance = enchantmentResults.stashChance;

                // Handle vanilla fortune
                if (info.applyFortune) {
                    const enchantable = itemStack.getTrait(ItemStackEnchantableTrait);
                    const fortuneLevel = enchantable?.getEnchantment(Enchantment.Fortune);
                    if (fortuneLevel && fortuneLevel > 0) {
                        itemCount *= this.calculateFortuneMultiplier(fortuneLevel);
                    }
                }
            }

            if (info.stashChance) StashHandler.handleStashChance(player, stashChance)

            if (player.getGamemode() !== Gamemode.Survival) return;

            if (itemCount <= 0) continue;
            const item = new ItemStack(itemId, { stackSize: itemCount });
            const inventory = player.getTrait(EntityInventoryTrait);

            if (!inventory.container.addItem(item)) {
                player.info(this.INV_FULL);
            }
        }
    }

    public static onPlace({ player, block }: PlayerPlaceBlockSignal): void {
        const island = player.getWorldIsland();
        if (!island) return;

        player.incrementCriteria("blocksPlaced", 1);

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
     * Handles custom enchantments that affect blocks.
     */
    private static handleEnchantments(
        itemStack: ItemStack,
        block: Block,
        initialItemId: string,
        initialCount: number,
        initialStashChance: number
    ): { itemId: string, count: number, stashChance: number } {
        let itemId = initialItemId;
        let count = initialCount;
        let stashChance = initialStashChance;

        if (!itemStack.isCustomEnchanted()) return { itemId, count, stashChance };

        const enchantments = itemStack.getCustomEnchantments() ?? [];

        for (const enchantment of enchantments) {
            const { id, level, info } = enchantment;
            const chance = info.activationChance;
            const effectiveChance = Math.max(chance.base - (level * chance.perLevel), chance.minimum);

            switch (id) {
                case "prospect":
                    stashChance *= (level * 0.09) + 1;
                    break;

                case "midas":
                    if (block.identifier === BlockIdentifier.Cobblestone && Math.random() * effectiveChance <= 1) {
                        itemId = ItemIdentifier.GoldOre;
                    }
                    break;

                case "molten":
                    if (this.smelted.has(itemId) && Math.random() * effectiveChance <= 1) {
                        itemId = this.smelted.get(itemId)!;
                    }
                    break;

                case "precious":
                    if (block.identifier === BlockIdentifier.MelonBlock && Math.random() * effectiveChance <= 1) {
                        itemId = ItemIdentifier.MelonBlock;
                        count = 1;
                    }
                    break;
            }
        }

        return { itemId, count, stashChance };
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