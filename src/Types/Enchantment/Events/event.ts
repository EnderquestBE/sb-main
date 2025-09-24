import { ItemStack, Player } from "@serenityjs/core";

interface EnchantmentEvent {
    player: Player;
    item: ItemStack;
    level: number;
}

export { EnchantmentEvent }