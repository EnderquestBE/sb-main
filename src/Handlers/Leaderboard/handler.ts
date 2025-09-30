import { Entity, EntityGravityTrait, EntityHealthTrait, EntityIdentifier, EntityNameableTrait, World } from "@serenityjs/core";
import { ActorFlag, Vector3f } from "@serenityjs/protocol";
import { Color } from "../../Types/types";
import { ByteTag, StringTag } from "@serenityjs/nbt";
import { IslandDatabase, PlayerDatabase } from "../../Classes";
import { ServerTaskHandler } from "../Server/handler";

interface LeaderboardEntry {
    rank: number;
    name: string;
    value: number;
}

class LeaderboardHandler {
    private static displays: Set<{ id: string, name: string, primary: Color, secondary: Color, collection: "player" | "island", criteria: { name: string, stat: string }, position: Vector3f, format: (entry: LeaderboardEntry) => string }> = new Set();

    public static register({ id, name, primary, secondary, collection, criteria, position, format }: { id: string, name: string, primary: Color, secondary: Color, collection: "player" | "island", criteria: { name: string, stat: string }, position: Vector3f, format: (entry: LeaderboardEntry) => string }) {
        this.displays.add({ id, name, primary, secondary, collection, criteria, position, format });
    }

    public static update(world: World) {
        const dimension = world.getDimension()
        const entities = dimension.getEntities()
        for (const { id, name, primary, secondary, collection: dbtype, criteria, format } of this.displays) {
            const collection = dbtype === "player" ? PlayerDatabase.instance.collection : IslandDatabase.instance.collection;
            collection.find().sort({ [criteria.stat]: -1 }).limit(10).toArray().then(results => {
                const entity = entities.find(e => e.identifier === EntityIdentifier.Tadpole && e.getStorageEntry("LeaderboardID")?.valueOf() === id);
                if (!entity) return;
                const statPath = criteria.stat.split(".");
                entity.setNametag(`${secondary}======= §l${primary}${name}§r ${secondary}=======\n${results.map((x, i) => {
                    let value = x;
                    for (const key of statPath) {
                        //@ts-ignore
                        value = value?.[key];
                    }
                    //@ts-ignore
                    return format({ rank: i + 1, name: x[criteria.name], value });
                }).join("\n")}`);
            });
        }
    }

    public static initialize(world: World) {
        const dimension = world.getDimension();
        for (const { id, position } of this.displays) {
            const entity = new Entity(dimension, EntityIdentifier.Tadpole);
            entity.position = position;
            entity.addTrait(EntityNameableTrait);
            entity.setNametag("Loading...");
            entity.setNametagAlwaysVisible(true);
            entity.setStorageEntry("LeaderboardID", new StringTag(id, "LeaderboardID"));
            entity.setStorageEntry("Persistent", new ByteTag(0, "Persistent"));
            entity.spawn();
        }
        ServerTaskHandler.queueTask(() => this.update(world), 100);
    }
}

export { LeaderboardHandler }