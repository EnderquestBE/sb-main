import { ItemStack, Player } from "@serenityjs/core"
import { Utils } from "../../Utils/utils";

function giveItemStack(
    this: { item: () => new (...args: any[]) => ItemStack; args: any[] },
    player: Player,
    amount: number
) {
    const ItemConstructor = this.item();
    const newItem = new ItemConstructor(...this.args);
    newItem.setStackSize(amount);
    player.inventory.addItem(newItem);
    return newItem.getStackSize() > 1
        ? `§6${newItem.getDisplayName()} §8x§c${newItem.getStackSize()}`
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

export { StashLoot, giveItemStack, giveMoney, giveXp }