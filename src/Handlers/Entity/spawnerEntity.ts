import { EntityIdentifier, ItemIdentifier, ItemStackEnchantableTrait, Player } from "@serenityjs/core";
import { Enchantment } from "@serenityjs/protocol";

type SpawnerEntityData = {
    health: number;
    loot: { item: ItemIdentifier, amount: [number, number] | number, cooked?: ItemIdentifier, applyLooting?: boolean }[];
    xp?: [number, number] | number
}

class SpawnerEntity {
    private static readonly SPAWNER_ENTITIES = new Map<EntityIdentifier, SpawnerEntityData>();

    public static get keys() {
        return Array.from(this.SPAWNER_ENTITIES.keys());
    }

    constructor(entity: EntityIdentifier, data: SpawnerEntityData) {
        SpawnerEntity.SPAWNER_ENTITIES.set(entity, data);
    }

    public static get(entity: EntityIdentifier): SpawnerEntityData | undefined {
        return this.SPAWNER_ENTITIES.get(entity);
    }

    public static is(entity: EntityIdentifier): boolean {
        return this.SPAWNER_ENTITIES.has(entity);
    }

    public static onKill(player: Player, entity: EntityIdentifier, looting?: number, fire?: boolean) {
        const data = this.SPAWNER_ENTITIES.get(entity);
        if (!data) return;

        // Get loot data.
        const { loot } = data

        // Check if the player has looting.
        const item = player.getHeldItem()
        if (item) {
            const enchantable = item.getTrait(ItemStackEnchantableTrait)
            if (enchantable) {
                const lootingLevel = enchantable.getEnchantment(Enchantment.Looting)
                if (lootingLevel) looting = lootingLevel;
                const fireAspectLevel = enchantable.getEnchantment(Enchantment.FireAspect)
                if (fireAspectLevel) fire = true;
            }
        }

        for (const itemData of loot) {
            const amount = this._processRange(itemData.amount, itemData.applyLooting ? looting : 0);
            if (amount > 0) {
                player.inventory.giveItem(fire && itemData.cooked ? itemData.cooked : itemData.item as any, amount);
            }
        }
        if (data.xp) {
            const xpAmount = this._processRange(data.xp, looting);
            player.addXp(xpAmount);
        }
    }

    public static _processRange(value: [number, number] | number, looting: number = 0): number {
        let low = 0;
        let high = 0;
        if (typeof value === "number") {
            low = value;
            high = value;
        }
        else {
            low = value[0];
            high = value[1];
        }
        return Math.floor(Math.random() * (high - low + 1 + looting)) + low;
    }
}

export { SpawnerEntity }