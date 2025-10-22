import { Serenity } from "@serenityjs/core";
import { ChatHandler } from "../Chat/handler";
import { Tips } from "../../Configuration/config";
import { EntityPersistenceTrait } from "../../Traits/Entity/Persistence/persistence";
import { Server } from "../../server";

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
                const islandWorlds = this.serenity.getWorlds().filter((x) => x.identifier.startsWith("sb_")).map((x) => x.getDimension());
                for (const dimension of islandWorlds) {
                    const entities = dimension.getEntities().filter((x) => x.hasTrait(EntityPersistenceTrait))
                    for (const entity of entities) {
                        entity.getTrait(EntityPersistenceTrait)?.despawn()
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

    public static randomTipsTask() {
        const { color, message } = Tips[Math.floor(Math.random() * Tips.length)]!
        ChatHandler.broadcast(`§l${color}»>\n§d[TIP]» §r${message}\n§l${color}»>`, this.serenity, false)
    }

    public static playerAutoSaveTask() {
        const defaultWorld = this.serenity.getWorld()
        const players = this.serenity.getPlayers();
        for (const player of players) {
            // Set their player position so they spawn at the default world spawn.
            const storage = player.getStorage()
            storage.setPosition(defaultWorld.getDimension().spawnPosition)

            // Save the player's data to the default dimension.
            defaultWorld.provider.writePlayer(player.uuid, storage);
        }
    }

    public static queryMultipliersTask() {
        Server.queryMultipliers();
    }

    public static queueTask(task: () => any, runAfter: number) {
        const timeout = setTimeout(() => {
            task();
        }, runAfter)
        this.tasks.push(timeout)
        return timeout
    }

    public static queueIntervalTask(task: () => any, interval: number) {
        const timeout = setTimeout(() => {
            task();
            this.queueIntervalTask(task, interval);
        }, interval)
        this.tasks.push(timeout)
        return timeout
    }

    public static initialize(serenity: Serenity) {
        this.serenity = serenity;
        // Queue clear entities tasks every 15 minutes.
        this.queueTask(() => {
            this.clearEntitiesTask();
        }, this.clearEntitiesInterval)
        // Queue random tips task every 10 minutes.
        this.queueIntervalTask(() => {
            this.randomTipsTask();
        }, 600000)
        // Queue player auto-save task every 10 minutes.
        this.queueIntervalTask(() => {
            this.playerAutoSaveTask();
        }, 600000)
        // Queue multiplier query task every 5 minutes.
        this.queueIntervalTask(() => {
            this.queryMultipliersTask();
        }, 300000)
    }

    public static clearAllTasks() {
        for (const task of this.tasks) {
            clearTimeout(task);
        }
    }
}

export { ServerTaskHandler }