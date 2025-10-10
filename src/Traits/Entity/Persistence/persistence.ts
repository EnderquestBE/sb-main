import { Entity, EntityIdentifier, EntityTrait } from "@serenityjs/core";
import { ByteTag } from "@serenityjs/nbt";
import { SpawnerEntity } from "../../../Handlers";


class EntityPersistenceTrait extends EntityTrait {
    public static readonly identifier = "persistence";
    public static readonly types = SpawnerEntity.keys.concat([EntityIdentifier.Item]);

    public constructor(entity: Entity) {
        super(entity);
        // Set non-save.
        this.entity.setStorageEntry("Persistent", new ByteTag(0, "Persistent"))
    }

    public despawn() {
        this.entity.despawn()
    }
}

export { EntityPersistenceTrait }