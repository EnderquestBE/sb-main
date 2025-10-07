import { BlockIdentifier, Entity, EntityIdentifier, EntityTrait, TraitOnTickDetails } from "@serenityjs/core";
import { ByteTag } from "@serenityjs/nbt";
import { Island } from "../../../Classes";
import { Vector3f } from "@serenityjs/protocol";
import { SpawnerEntity } from "../../../Handlers";

class EntityPersistenceTrait extends EntityTrait {
    public static readonly identifier = "persistence";
    public static readonly types = SpawnerEntity.keys.concat([EntityIdentifier.Item]);

    private static DESTRUCTIVE_BLOCKS = new Set<string>([
        BlockIdentifier.Lava,
        BlockIdentifier.FlowingLava,
        BlockIdentifier.Fire,
        BlockIdentifier.Cactus,
    ]);

    public IS_ITEM: boolean;

    public constructor(entity: Entity) {
        super(entity);
        // Set non-save.
        this.IS_ITEM = entity.identifier === EntityIdentifier.Item;
        this.entity.setStorageEntry("Persistent", new ByteTag(0, "Persistent"))
    }

    public onTick({ currentTick }: TraitOnTickDetails): void {
        if (Number(currentTick) % 20 !== 0) return;
        if (this.IS_ITEM) {
            if (EntityPersistenceTrait.DESTRUCTIVE_BLOCKS.has(this.dimension.getBlock(this.entity.position).identifier)) {
                this.entity.despawn();
            }
        } else if (this.entity.isFalling) {
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