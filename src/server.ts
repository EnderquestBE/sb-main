import { Player, Serenity, WorldEvent } from "@serenityjs/core";
import { Logger, LoggerColors } from "@serenityjs/logger";
import { CommandBuilder, DatabaseService, Island, IslandDatabase, PlayerDatabase } from "./Classes";
import { PlayerExtension } from "./extensions/player";
import { Scorebar } from "./Handlers/Scorebar/scorebar";
import { Warp } from "./Classes/Warp/warp";
import { BoundaryHandler } from "./Handlers/Boundary/handler";
import { MainShop } from "./Configuration/Shop/Main/main";
import { VendorDatabase } from "./Classes/Database/Collections/Vendor";
import { IslandPerkUnlocks } from "./Handlers/Island/perks";
import { ServerTaskHandler } from "./Handlers/Server/handler";
import { registerIslandHelpCommands } from "./Commands/Island/help";
import { Utils } from "./Utils/utils";

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
        // Register island command helper.
        registerIslandHelpCommands(this.instance.commandPalette.commands.get("island")!.registry.overloads.keys().map((x) => {
            const parameters = Object.keys(x)
            return {
                //@ts-ignore
                name: x[parameters[0]!].identifier.substring(6).toLowerCase(), params: parameters.slice(1).map((p) => {
                    const arg = x[p]!
                    if (Array.isArray(arg)) return { type: arg[0].identifier, name: p, optional: arg[1] }
                    else return { type: arg.identifier, name: Utils.formatString(p), optional: false }
                })
            }
        }).toArray().sort((a, b) => a.name.localeCompare(b.name)));
        // Start Scorebar runtime.
        instance.on(WorldEvent.WorldTick, async (event) => {
            Scorebar.runtime(event)
            BoundaryHandler.runtime(event)
        })
        // Initialize shop instances.
        MainShop.initialize()
        ServerTaskHandler.queueTask(() => {
            for (let player of this.instance.getPlayers()) {
                this.onPlayerJoin(player)
            }
        }, 1500)
    }

    public static onStartUp() { }

    public static async onShutDown() {
        await this.database.disconnect();
        ServerTaskHandler.clearAllTasks();
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
                /*
                if (island.getOnlineOwners().length <= 1) {
                    LevelDBProvider.loadWorld(this.instance, island.getWorldId())
                }
                */
                if (island.isOwner(player.xuid)) IslandPerkUnlocks.applyPermissions(player, island);
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
                            survivor.info(`§cYou have been kicked from §e${island.getName()}§c: Island has gone offline.`)
                        }
                        // Unload island from storage.
                        //this.instance.unregisterWorld(world)
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
        new IslandDatabase(this.database);
        new VendorDatabase(this.database);
    }
}

export { Server }