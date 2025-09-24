import { Block, Entity, ItemStack, Player } from "@serenityjs/core";
import { CustomEnchantment } from "../../Classes/Enchantment/customEnchantment";
import { EnchantmentRarity } from "../../Types/types";


class EnchantmentHandler {
    private static enchantmentsById: Map<string, CustomEnchantment> = new Map();
    private static enchantmentsByRarity: Map<EnchantmentRarity, CustomEnchantment[]> = new Map();

    public static get keys(): string[] {
        return Array.from(EnchantmentHandler.enchantmentsById.keys());
    }

    public static getById(id: string): CustomEnchantment | undefined {
        return this.enchantmentsById.get(id);
    }

    public static getAllOfRarity(rarity: EnchantmentRarity): CustomEnchantment[] {
        return this.enchantmentsByRarity.get(rarity)!;
    }

    public static register(enchantment: CustomEnchantment) {
        this.enchantmentsById.set(enchantment.id, enchantment);
        const rarityEnchants = this.enchantmentsByRarity.get(enchantment.rarity) ?? [];
        rarityEnchants.push(enchantment)
        this.enchantmentsByRarity.set(enchantment.rarity, rarityEnchants);
    }

    public static onBlockBreak(player: Player, item: ItemStack | null, block: Block) {
        if (!item) return;
        const enchantments = item.getCustomEnchantments();
        if (!enchantments) return;
        for (const { level, info } of enchantments) {
            if (!info.blockBreak) continue
            const chance = info.activationChance;
            const effectiveChance = Math.max(chance.base - (level * chance.perLevel), chance.minimum);
            if (Math.random() * effectiveChance <= 1) info.blockBreak?.({ player, item, block, level });
        }
    }

    public static onEntityHurt(player: Player, target: Entity, amount: number) {
        if (!player || !player.isPlayer()) return;
        const item = player.getHeldItem();
        if (!item) return;
        const enchantments = item.getCustomEnchantments();
        if (!enchantments) return;
        for (const { level, info } of enchantments) {
            if (!info.entityHurt) continue
            const chance = info.activationChance;
            const effectiveChance = Math.max(chance.base - (level * chance.perLevel), chance.minimum);
            if (Math.random() * effectiveChance <= 1) info.entityHurt?.({ player, item, target, damage: amount, level });
        }
    }
}

export { EnchantmentHandler };