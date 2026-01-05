import { Entity, EntityIdentifier, EntityNameableTrait, World } from "@serenityjs/core";
import { ByteTag } from "@serenityjs/nbt";
import { IPosition, Vector3f } from "@serenityjs/protocol";
import { EntityClientRenderTrait } from "../../Traits/Entity/Slapper/clientRender";

class HologramHandler {
    private static holograms: Set<{ name: string, position: Vector3f }> = new Set();

    public static register({ name, position }: { name: string, position: IPosition }) {
        this.holograms.add({ name, position: new Vector3f(position.x, position.y, position.z) });
    }

    public static spawnStats(world: World) {
        const dimension = world.getDimension();
        const entity = new Entity(dimension, EntityIdentifier.Tadpole);
        entity.position = new Vector3f(0.5, 64.5, -16.5);
        entity.addTrait(EntityClientRenderTrait, "Stats");
        entity.spawn();
    }

    public static initialize(world: World) {
        const dimension = world.getDimension();
        this.spawnStats(world);
        for (const { name, position } of this.holograms) {
            const entity = new Entity(dimension, EntityIdentifier.Tadpole);
            entity.position = position;
            entity.addTrait(EntityNameableTrait);
            entity.setNametag(name);
            entity.setNametagAlwaysVisible(true);
            entity.setStorageEntry("Persistent", new ByteTag(0, "Persistent"));
            entity.spawn();
        }
    }
}

export { HologramHandler }