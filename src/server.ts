import { Player, Serenity, WorldEvent } from "@serenityjs/core";
import { Logger, LoggerColors } from "@serenityjs/logger";
import { CommandBuilder, DatabaseService, IslandDatabase, PlayerDatabase } from "./Classes/classes";
import { PlayerExtension } from "./extensions/player";
import { Scorebar } from "./Scorebar/scorebar";

class Server {
    public static readonly logger: Logger = new Logger("Enderquest", LoggerColors.LightPurple);

    public static instance: Serenity

    private static database: DatabaseService;

    public static initialize(instance: Serenity) {
        this.instance = instance
        this.database = new DatabaseService()
        // Register database.
        this.registerDBService()
        // Register commands.
        CommandBuilder.registerAll(this.instance.commandPalette);
        // Start Scorebar runtime.
        Scorebar.runtime(this.instance)
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
        // Initialize scorebar.
        Scorebar.initialize(player, player.world)
    }

    public static async onPlayerLeave(player: Player) {
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