import { Entity } from "@serenityjs/core";
import { EnchantmentEvent } from "./event";

interface EntityHurtEnchantmentEvent extends EnchantmentEvent {
    target: Entity;
    damage: number;
}

export { EntityHurtEnchantmentEvent }