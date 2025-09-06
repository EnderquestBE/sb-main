import { Serenity, WorldEvent } from "@serenityjs/core";
import { Logger, LoggerColors } from "@serenityjs/logger";
import { CommandBuilder, DatabaseService, IslandDatabase, PlayerDatabase } from "./Classes/classes";
import { PlayerExtension } from "./extensions/player";
import { DisplaySlotType } from "@serenityjs/protocol";
import { Scorebar } from "./Scoreboard/scoreboard";

class Server {
    public static readonly logger: Logger = new Logger("Enderquest", LoggerColors.LightPurple);

    public static instance: Serenity

    private static database: DatabaseService;

    public static initialize(instance: Serenity) {
        this.instance = instance
        this.database = new DatabaseService()
        // Register database.
        this.registerDBService()
        // Register player events.
        this.registerPlayerEvents()
        // Register commands.
        CommandBuilder.registerAll(this.instance.commandPalette);
        // Start Scorebar runtime.
        Scorebar.runtime(this.instance)
    }

    private static async registerDBService() {
        await this.database.connect();
        new PlayerDatabase(this.database);
        new IslandDatabase(this.database)
    }

    private static async registerPlayerEvents() {
        /**
         * @event onJoin
         */
        this.instance.on(WorldEvent.PlayerJoin, async ({ player }) => {
            // Load player data.
            const session = await PlayerExtension.loadSession(player);
            if (!session) {
                await PlayerExtension.createSession(player);
                this.logger.info(`Created new session for player ${player.username}.`);
            } else {
                this.logger.info(`Loaded session for player ${player.username}.`);
            }
            // Initialize scorebar.
            Scorebar.initialize(player)
        });
        /**
         * @event onLeave
         */
        this.instance.on(WorldEvent.PlayerLeave, ({ player }) => {
            // Uncache player data.
            PlayerExtension.removeSession(player);
            this.logger.info(`Removed session for player ${player.username}.`);
        });
    }

}

export { Server }