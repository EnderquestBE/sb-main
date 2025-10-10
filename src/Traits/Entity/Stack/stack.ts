import { Entity, EntityAttributeTrait, EntityDespawnOptions, EntityHealthTrait, EntityIdentifier, EntitySpawnOptions, ItemStackEnchantableTrait, Player, PlayerCombatTrait } from "@serenityjs/core";
import { ByteTag, ShortTag } from "@serenityjs/nbt";
import { Utils } from "../../../Utils/utils";
import { ActorDamageCause, ActorEvent, ActorEventPacket, AnimateId, AnimatePacket, AttributeName, Enchantment } from "@serenityjs/protocol";
import { SpawnerEntity, EnchantmentHandler } from "../../../Handlers";
import { EntityFlammableTrait } from "../traits";

class EntityStackTrait extends EntityAttributeTrait {
    public static readonly identifier = "stack";
    public static readonly types = SpawnerEntity.keys
    public readonly attribute = AttributeName.Health;

    private aliveState = true;

    private isArthropod = false;
    private isUndead = false;

    public constructor(entity: Entity) {
        super(entity);
        if (entity.getTrait(EntityHealthTrait)) entity.removeTrait(EntityHealthTrait)
        const entityInfo = SpawnerEntity.get(this.entity.identifier)
        if (!entityInfo) {
            console.error("No entity info found for", this.entity.identifier)
            return
        }
        // Add to groups.
        if (this.entity.identifier === EntityIdentifier.Spider) this.isArthropod = true;
        else if (this.entity.identifier === EntityIdentifier.Zombie || this.entity.identifier === EntityIdentifier.Skeleton || this.entity.identifier === EntityIdentifier.ZombiePigman) this.isUndead = true;
        // Set attribute values.
        super.onAdd({
            minimumValue: 0,
            maximumValue: entityInfo.health,
            defaultValue: entityInfo.health,
            currentValue: entityInfo.health
        })
        // Set non-save.
        this.entity.setStorageEntry("Persistent", new ByteTag(0, "Persistent"))
    }

    public onDamage(
        damager?: Entity,
        damage?: number
    ): void {
        if (damager && !(damager instanceof Player)) return;

        // Calculate damage to do.
        let amount = damage ?? 0;
        if (damager) {
            const combat = damager.getTrait(PlayerCombatTrait)
            if (combat.isOnCooldown) return
            const critical = !combat.isOnCriticalCooldown && !damager.onGround
            amount = combat.getCalculatedDamage()

            // Get enchantment bonuses.
            const item = damager.getHeldItem()
            if (item) {
                const enchantable = item.getTrait(ItemStackEnchantableTrait)
                if (enchantable) {
                    const enchantments = enchantable.getEnchantments()
                    for (const [id, level] of enchantments) {
                        // Apply fire aspect.
                        if (id === Enchantment.FireAspect)
                            if (this.entity.hasTrait(EntityFlammableTrait))
                                this.entity.getTrait(EntityFlammableTrait).setOnFire(Math.floor(level / 2) + 1);
                        // Apply damage enchantments.
                        if (id === Enchantment.BaneOfArthropods && this.isArthropod)
                            amount += 2.5 * level
                        else if (id === Enchantment.Smite && this.isUndead)
                            amount += 2.5 * level
                        else if (id === Enchantment.Sharpness)
                            amount += 1 + (level - 1) * 0.5
                    }
                }
            }

            if (critical) {
                // Create a new animate packet for the critical hit.
                const packet = new AnimatePacket();

                // Set the properties of the animate packet.
                packet.id = AnimateId.CriticalHit;
                packet.runtimeEntityId = this.entity.runtimeId;
                packet.boatRowingTime = null;

                // Broadcast the animate packet to the dimension of the player.
                damager.dimension.broadcast(packet);

                // Start the critical cooldown
                combat.startCriticalCooldown();
            }
            combat.startCooldown();

            // Handle custom enchantments on entity hit.
            EnchantmentHandler.onEntityHurt(damager, this.entity, amount);
        }

        // Calculate the new health value
        this.currentValue = Math.max(this.currentValue - amount, 1);

        // Create a new ActorEventPacket
        const packet = new ActorEventPacket();
        packet.actorRuntimeId = this.entity.runtimeId;
        packet.event = ActorEvent.Hurt;
        packet.data = ActorDamageCause.EntityAttack;

        // Broadcast the packet to all players
        this.entity.dimension.broadcast(packet);

        if (this.currentValue === 1 && this.aliveState === true) {
            this.aliveState = false;
            this.onKill(damager);
        }
    }

    public onSpawn(details: EntitySpawnOptions): void {
        // Check if the entity is not being spawned for the first time
        if (details.initialSpawn) return;

        // Reset the health value
        this.currentValue = this.defaultValue;
    }

    public onDespawn(details: EntityDespawnOptions): void {
        // If the entity is disconnected & the current value is less than or equal to the minimum value,
        if (details.disconnected && this.currentValue <= this.minimumValue)
            this.currentValue = this.maximumValue; // Reset the health value to the maximum value
    }

    public onKill(player?: Player): void {
        // Handle loot.
        SpawnerEntity.onKill(this.entity, player);
        // Handle decrement.
        const stack = this.entity.getStorageEntry<ShortTag>("MobStack")?.valueOf()
        if (stack && stack > 1) {
            this.entity.setStorageEntry("MobStack", new ShortTag(stack - 1, "MobStack"))
            this.entity.setNametag(`§l§e${Utils.formatString(this.entity.identifier)} §7x§c${stack - 1}`)
            this.entity.setNametagAlwaysVisible(true);
            this.currentValue = this.defaultValue;
            this.aliveState = true;
        } else {
            this.entity.kill();
        }
    }
}

export { EntityStackTrait };