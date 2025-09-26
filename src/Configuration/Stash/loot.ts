import { ItemStack, Player } from "@serenityjs/core"
import { Utils } from "../../Utils/utils";

function giveItem(this: { id: string, display: string }, player: Player, amount: number) {
    player.inventory.giveItem(this.id, amount);
    return this.display;
}

function giveItemStack<T extends new (...args: any[]) => ItemStack>(
    this: { item: T; args: ConstructorParameters<T> },
    player: Player,
    amount: number
) {
    const newItem = new this.item(...this.args);
    newItem.stackSize = amount;
    player.inventory.addItem(newItem);
    return newItem.stackSize > 1
        ? `§6${newItem.getDisplayName()} §8x§c${newItem.stackSize}`
        : `a §6${newItem.getDisplayName()}`;
}

function giveMoney(player: Player, amount: number) {
    player.addMoney(amount);
    return "§6$" + Utils.formatInt(amount);
}

function giveXp(player: Player, amount: number) {
    player.addXp(amount);
    return "§a" + amount + " XP";
}

type StashLoot = {
    function: (player: Player, amount: number) => string, // Function to execute when the stash is opened, returns display name.
    amount?: [number, number] | number, // Amount range for the loot (min, max).
}

export { StashLoot, giveItem, giveItemStack, giveMoney, giveXp }