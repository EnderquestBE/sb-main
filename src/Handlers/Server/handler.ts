import { Serenity } from "@serenityjs/core";
import { EntityPersistenceTrait } from "../../Traits/Entity/traits";
import { ChatHandler } from "../Chat/handler";

class ServerTaskHandler {
    private static serenity: Serenity;

    private static readonly clearEntitiesInterval = 1 * 60 * 1000; // 15 minutes

    public static clearEntitiesTask() {
        ChatHandler.broadcast("§c§lGround entities will be cleared in 1 minute...", this.serenity)
        this.queueTask(50000, () => {
            ChatHandler.broadcast("§c§lGround entities will be cleared in 10 seconds...", this.serenity)
            this.queueTask(7000, () => {
                ChatHandler.broadcast("§c§lGround entities will be cleared in 3 seconds....", this.serenity)
            })
            this.queueTask(8000, () => {
                ChatHandler.broadcast("§c§lGround entities will be cleared in 2 seconds...", this.serenity)
            })
            this.queueTask(9000, () => {
                ChatHandler.broadcast("§c§lGround entities will be cleared in 1 second...", this.serenity)
            })
            this.queueTask(10000, () => {
                for (const dimension of this.serenity.getWorlds().filter((x) => x.identifier.startsWith("sb_")).map((x) => x.getDimension())) {
                    const entities = dimension.getEntities().filter((x) => x.hasTrait(EntityPersistenceTrait))
                    for (const entity of entities) {
                        entity.getTrait(EntityPersistenceTrait).despawn()
                    }
                }
                ChatHandler.broadcast("§c§lGround entities have been cleared.", this.serenity)
            })
        })
    }

    public static queueTask(runAfter: number, task: () => void) {
        setTimeout(() => {
            task();
        }, runAfter);
    }

    public static initialize(serenity: Serenity) {
        this.serenity = serenity;
        this.queueTask(this.clearEntitiesInterval, () => {
            this.clearEntitiesTask();
        })
    }
}

export { ServerTaskHandler }