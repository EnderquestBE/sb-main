import { Dimension } from "@serenityjs/core";
import { SpawnerEntity } from "../Handlers/Entity/spawnerEntity";

declare module "@serenityjs/core" {
    interface Dimension {
        clearEntities(options?: { excludeItems?: boolean }): void;
    }
}

Dimension.prototype.clearEntities = function (options?: { excludeItems?: boolean }) {
    const entities = this.getEntities().filter((x) => SpawnerEntity.get(x.identifier) || x.isItem() && !options?.excludeItems);
    console.log("Cleared Entities", entities.map((x) => x.identifier).join(", "))
    for (const entity of entities) {
        entity.despawn()
    }
}