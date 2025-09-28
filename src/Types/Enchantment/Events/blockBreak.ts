import { Block } from "@serenityjs/core";
import { EnchantmentEvent } from "./event";

interface BlockBreakEnchantmentEvent extends EnchantmentEvent {
    block: Block;
}

export { BlockBreakEnchantmentEvent }