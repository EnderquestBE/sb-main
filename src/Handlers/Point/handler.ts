import {
    EntityInventoryTrait,
    ItemStack,
    ItemStackEnchantableTrait,
    PlayerBreakBlockSignal,
    PlayerPlaceBlockSignal,
} from "@serenityjs/core";
import { BlockPointValues } from "../../Configuration/Point/point";
import { Utils } from "../../Utils/utils";
import { Enchantment, Gamemode } from "@serenityjs/protocol";

type ValueOrRange = number | [number, number];

class PointHandler {
    private static readonly INV_FULL = "§cYour inventory is full!";
    private static readonly fortunePool = new Map<number, number[]>();

    private static _cacheFortunePool(level: number) {
        const pool: number[] = [1, 1];
        for (let i = 2; i <= level + 1; i++) {
            pool.push(i);
        }
        this.fortunePool.set(level, pool);
    }

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

    public static onBreak({ player, block }: PlayerBreakBlockSignal): void {
        const island = player.getWorldIsland();
        if (!island) return;

        const info = BlockPointValues[block.identifier]?.break;
        if (!info) {
            if (player.gamemode === Gamemode.Survival) {
                const item = new ItemStack(block.identifier, { stackSize: 1 });
                const inventory = player.getTrait(EntityInventoryTrait);
                if (!inventory.container.addItem(item)) {
                    player.info(this.INV_FULL);
                }
            }
            return;
        }

        // Get item info.
        let itemId = info.item ?? block.identifier;
        let itemCount = info.amount ? Utils.randomInt(info.amount[0], info.amount[1]) : 1;

        // Handle point data.
        if (info.points) {
            this._processRange(info.points, (val) => island.addPoints(val));
        }
        if (info.xp) {
            const value = (this._processRange(info.xp, (val) => player.addXp(val)))
            if (value && player.getSetting("showXpOverlay")) player.onScreenDisplay.setActionBar(`§l§e>> §aCollected §d${value} §6XP §e<<§r`)
        }
        if (info.applyFortune) {
            const heldItem = player.getHeldItem();
            if (heldItem) {
                const enchantable = heldItem.getTrait(ItemStackEnchantableTrait)
                if (enchantable) {
                    const fortuneLevel = enchantable.getEnchantment(Enchantment.Fortune)

                    if (fortuneLevel && fortuneLevel > 0) {
                        const pool = this.fortunePool.get(fortuneLevel)!
                        const multiplier = pool[Utils.randomInt(0, pool.length - 1)]!
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

    public static initialize() {
        for (let i = 0; i < 10;) {
            this._cacheFortunePool(++i)
        }
    }
}

export { PointHandler };