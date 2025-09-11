import {
    EntityInventoryTrait,
    ItemStack,
    PlayerBreakBlockSignal,
    PlayerPlaceBlockSignal,
} from "@serenityjs/core";
import { BlockPointValues } from "../../Configuration/Point/point";
import { Utils } from "../../Utils/utils";
import { Gamemode } from "@serenityjs/protocol";

// For better type safety and readability
type ValueOrRange = number | [number, number];

class PointHandler {
    private static readonly INV_FULL = "§cYour inventory is full!";

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
        if (info) {
            if (info.points) {
                this._processRange(info.points, (val) => island.addPoints(val));
            }
            if (info.xp) {
                const value = (this._processRange(info.xp, (val) => player.addExperience(val)))
                if (value && player.getSetting("showXpOverlay")) player.onScreenDisplay.setActionBar(`§l§e>> §aCollected §d${value} §6XP §e<<§r`)
            }
        }

        if (player.gamemode !== Gamemode.Survival) return

        const itemId = info?.item ?? block.identifier;
        const itemCount = info?.amount ? Utils.randomInt(info.amount[0], info.amount[1]) : 1;

        if (itemCount <= 0) return;
        const item = new ItemStack(itemId, { stackSize: itemCount });
        const inventory = player.getTrait(EntityInventoryTrait);

        if (!inventory.container.addItem(item)) {
            player.info(this.INV_FULL);
        }

        // Debug logging
        //console.log(`Item: ${item.identifier}, Amount: ${itemCount}`);
        //console.log("LEVEL:", player.getLevel(), "EXPERIENCE:", player.getExperience());
    }

    public static onPlace({ player, block }: PlayerPlaceBlockSignal): void {
        const island = player.getWorldIsland();
        if (!island) return;

        const points = BlockPointValues[block.identifier]?.place?.points;
        if (points) {
            island.addPoints(points);
        }
    }
}

export { PointHandler };