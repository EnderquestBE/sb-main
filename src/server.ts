import { Player, Serenity, WorldEvent } from "@serenityjs/core";
import { Logger, LoggerColors } from "@serenityjs/logger";
import { CommandBuilder, DatabaseService, Island, IslandDatabase, PlayerDatabase } from "./Classes/classes";
import { PlayerExtension } from "./extensions/player";
import { Scorebar } from "./Handlers/Scorebar/scorebar";
import { Warp } from "./Classes/Warp/warp";
import { BoundaryHandler } from "./Handlers/Boundary/handler";
import { MainShop } from "./Configuration/Shop/Main/main";
import { IslandDBProvider } from "./Classes/LevelProvider/customdb";

class Server {
    public static readonly logger: Logger = new Logger("Enderquest", LoggerColors.LightPurple);

    public static instance: Serenity

    private static database: DatabaseService;

    public static initialize(instance: Serenity) {
        this.instance = instance
        this.database = new DatabaseService()
        // Register database.
        this.registerDBService()
        // Register warp locations and commands.
        Warp.registerAll()
        // Register commands.
        CommandBuilder.registerAll(this.instance.commandPalette);
        // Start Scorebar runtime.
        instance.on(WorldEvent.WorldTick, async (event) => {
            Scorebar.runtime(event)
            BoundaryHandler.runtime(event)
        })
        // Initialize shop instances.
        MainShop.initialize()
        setTimeout(() => {
            for (let player of this.instance.getPlayers()) {
                this.onPlayerJoin(player)
            }
        }, 1500)
    }

    public static onStartUp() { }

    public static async onShutDown() {
        await this.database.disconnect();
        for (let player of this.instance.getPlayers()) {
            this.onPlayerLeave(player)
        }
    }

    public static async onPlayerJoin(player: Player) {
        // Load player data.
        const session = await PlayerExtension.loadSession(player);
        if (!session) {
            await PlayerExtension.createSession(player);
            this.logger.info(`Created new session for player ${player.username}.`);
        } else {
            this.logger.info(`Loaded session for player ${player.username}.`);
        }

        // Load island into cache
        const islandName = player.getIslandName();
        if (islandName) {
            // Load island
            const island = await Island.load(islandName);
            if (island) {
                // Load island world from storage.
                if (island.getOnlineOwners().length <= 1) {
                    IslandDBProvider.loadWorld(this.instance, island.getWorldId())
                }
                this.logger.info(`Loaded island §e${islandName}§r into cache for ${player.username}.`);
            } else {
                this.logger.error(`§cFailed to load island data for ${player.username}.`)
            }
        }

        // Initialize scorebar.
        Scorebar.initialize(player, player.world)
    }

    public static async onPlayerLeave(player: Player) {
        const islandName = player.getIslandName();
        if (islandName) {
            const island = await Island.load(islandName);
            if (island) {
                if (island.getOnlineOwners().length === 0) {
                    // Unload island.
                    Island.unload(islandName)
                    const world = this.instance.getWorld(island.getWorldId())
                    if (world) {
                        // Kick players still in the world, such as island visitors.
                        const players = world.getPlayers()
                        for (const survivor of players) {
                            Warp.to(survivor, "SPAWN")
                            survivor.info(`§cThe island §e${island.getName()} §cis now offline.`)
                        }
                        // Unload island from storage.
                        //@ts-ignore
                        this.instance.unregisterWorld(world)
                    }
                }
                this.logger.info(`Unloaded island §e${islandName}§r from cache.`)
            }
        }
        // Uncache player data.
        player.setTimePlayed(player.getTimePlayed())
        PlayerExtension.removeSession(player);
        this.logger.info(`Removed session for player ${player.username}.`);
    }

    private static async registerDBService() {
        await this.database.connect();
        new PlayerDatabase(this.database);
        new IslandDatabase(this.database)
    }
}

export { Server }