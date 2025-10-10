import { Entity, EntityIdentifier, ItemIdentifier, ItemStack, ItemStackEnchantableTrait, Player } from "@serenityjs/core";
import { Enchantment } from "@serenityjs/protocol";

type SpawnerEntityData = {
    health: number;
    height: number;
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

    public static onKill(entity: Entity, player?: Player) {
        const data = this.SPAWNER_ENTITIES.get(entity.identifier);
        if (!data) return;

        // Get loot data.
        const { loot } = data
        let looting = 0;
        let additionalXp = 0;

        // Check if the entity is on fire.
        let fire = false;
        if (entity.hasTrait("flammable")) {
            //@ts-ignore
            if (entity.getTrait("flammable").isOnFire()) fire = true;
        }

        if (player) {

            const item = player.getHeldItem()
            if (item) {
                // Check applicable VEs.
                const enchantable = item.getTrait(ItemStackEnchantableTrait)
                if (enchantable) {
                    // Looting
                    const lootingLevel = enchantable.getEnchantment(Enchantment.Looting)
                    if (lootingLevel) looting = lootingLevel;
                }
                // Check applicable CEs.
                if (item.isCustomEnchanted()) {
                    const enchantments = item.getCustomEnchantments();
                    if (!enchantments) return;
                    for (const { id, info, level } of enchantments) {
                        // Scholar
                        if (id === "scholar") {
                            const chance = info.activationChance;
                            const effectiveChance = Math.max(chance.base - (level * chance.perLevel), chance.minimum);
                            if (Math.random() * effectiveChance <= 1) additionalXp += Math.floor(Math.random() * Math.ceil(level / 2)) + 1;
                        }
                    }
                }
            }

            for (const itemData of loot) {
                const amount = this._processRange(itemData.amount, itemData.applyLooting ? looting : 0);
                if (amount > 0) {
                    player.inventory.giveItem(fire && itemData.cooked ? itemData.cooked : itemData.item, amount);
                }
            }
            if (data.xp) {
                let xpAmount = this._processRange(data.xp, looting);
                if (additionalXp > 0) xpAmount += additionalXp;
                player.addXp(xpAmount);
                if (xpAmount && player.getSetting("showXpOverlay")) player.onScreenDisplay.setActionBar(`§l§e>> §aCollected §d${xpAmount} §6XP §e<<§r`);
            }

            // Increment player statistic.
            player.incrementCriteria("mobsSlayed", 1);

        }

        // Handle loot when the entity is not killed by a player.
        else {
            for (const itemData of loot) {
                entity.dimension.spawnItem(new ItemStack(fire && itemData.cooked ? itemData.cooked : itemData.item, { stackSize: this._processRange(itemData.amount) }), entity.position);
            }
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