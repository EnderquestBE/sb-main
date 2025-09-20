import { Entity, EntityIdentifier, EntityTrait, TraitOnTickDetails } from "@serenityjs/core";
import { ByteTag } from "@serenityjs/nbt";
import { Island } from "../../../Classes/classes";
import { Vector3f } from "@serenityjs/protocol";
import { SpawnerEntity } from "../../../Handlers/Entity/spawnerEntity";

class EntityPersistenceTrait extends EntityTrait {
    public static readonly identifier = "item-stack";
    public static readonly types = SpawnerEntity.keys.concat([EntityIdentifier.Item]);

    public constructor(entity: Entity) {
        super(entity);
        // Set non-save.
        this.entity.nbt.set("Persistent", new ByteTag(0, "Persistent"))
    }

    public onTick({ currentTick }: TraitOnTickDetails): void {
        if (Number(currentTick) % 5 !== 0) return;
        if (this.entity.position.y < -24) {
            const island = Island.loadSync(this.dimension.world.identifier.slice(3));
            if (island) {
                const spawn = island.getSpawn();
                if (spawn) this.entity.teleport(new Vector3f(spawn.x + 0.5, spawn.y + 1, spawn.z + 0.5), this.dimension);
            }
        }
    }

    public despawn() {
        this.entity.despawn()
    }
}

export { EntityPersistenceTrait }