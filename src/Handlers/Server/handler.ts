import { Serenity } from "@serenityjs/core";
import { EntityPersistenceTrait } from "../../Traits/Entity/traits";
import { ChatHandler } from "../Chat/handler";

class ServerTaskHandler {
    private static serenity: Serenity;

    private static readonly clearEntitiesInterval = 15 * 60 * 1000; // 15 minutes

    private static readonly tasks: NodeJS.Timeout[] = [];

    public static clearEntitiesTask() {
        ChatHandler.broadcast("§c§lGround entities will be cleared in 1 minute...", this.serenity)
        this.queueTask(() => {
            ChatHandler.broadcast("§c§lGround entities will be cleared in 10 seconds...", this.serenity)
            this.queueTask(() => {
                ChatHandler.broadcast("§c§lGround entities will be cleared in 3 seconds....", this.serenity)
            }, 7000)
            this.queueTask(() => {
                ChatHandler.broadcast("§c§lGround entities will be cleared in 2 seconds...", this.serenity)
            }, 8000)
            this.queueTask(() => {
                ChatHandler.broadcast("§c§lGround entities will be cleared in 1 second...", this.serenity)
            }, 9000)
            this.queueTask(() => {
                for (const dimension of this.serenity.getWorlds().filter((x) => x.identifier.startsWith("sb_")).map((x) => x.getDimension())) {
                    const entities = dimension.getEntities().filter((x) => x.hasTrait(EntityPersistenceTrait))
                    for (const entity of entities) {
                        entity.getTrait(EntityPersistenceTrait).despawn()
                    }
                }
                ChatHandler.broadcast("§c§lGround entities have been cleared.", this.serenity)
                // Queue next clear.
                this.queueTask(() => {
                    this.clearEntitiesTask();
                }, this.clearEntitiesInterval)
            }, 10000)
        }, 50000)
    }

    public static queueTask(task: () => any, runAfter: number) {
        const timeout = setTimeout(() => {
            task();
        }, runAfter)
        this.tasks.push(timeout)
        return timeout
    }

    public static initialize(serenity: Serenity) {
        this.serenity = serenity;
        this.queueTask(() => {
            this.clearEntitiesTask();
        }, this.clearEntitiesInterval)
    }

    public static clearAllTasks() {
        for (const task of this.tasks) {
            clearTimeout(task);
        }
    }
}

export { ServerTaskHandler }