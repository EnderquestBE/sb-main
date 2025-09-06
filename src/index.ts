import { Serenity, WorldEvent } from "@serenityjs/core";
import { Logger, LoggerColors } from "@serenityjs/logger";
import { Plugin, PluginEvents } from "@serenityjs/plugins";
import { CommandBuilder, DatabaseService, IslandDatabase, PlayerDatabase } from "./Classes/classes";
import { PlayerExtension } from "./extensions/player";

class Server {
  public static readonly logger: Logger = new Logger("Enderquest", LoggerColors.LightPurple);

  public static instance: Serenity

  private static database: DatabaseService;

  public static initialize() {
    this.database = new DatabaseService()
    // Register database.
    this.registerDBService()
    // Register player events.
    this.registerPlayerEvents()
  }

  private static async registerDBService() {
    await this.database.connect();
    new PlayerDatabase(this.database);
    new IslandDatabase(this.database)
  }

  private static async registerPlayerEvents() {
    this.instance.on(WorldEvent.PlayerJoin, async ({ player }) => {
      const session = await PlayerExtension.loadSession(player);
      if (!session) {
        await PlayerExtension.createSession(player);
        this.logger.info(`Created new session for player ${player.username}.`);
      } else {
        this.logger.info(`Loaded session for player ${player.username}.`);
      }
    });
    this.instance.on(WorldEvent.PlayerLeave, ({ player }) => {
      PlayerExtension.removeSession(player);
      this.logger.info(`Removed session for player ${player.username}.`);
    });
  }

}

class EnderquestPlugin extends Plugin implements PluginEvents {

  public constructor() {
    super("ender-quest", "0.0.1+indev");
  }

  public async onInitialize(): Promise<void> {
    CommandBuilder.registerAll()
    Server.instance = this.serenity
    Server.initialize()
  }

  public onStartUp(): void {
    this.logger.info("§5Ender§dquest§r has started.");
  }

  public onShutDown(): void {
    this.logger.info("§5Ender§dquest§r has stopped safely.");
  }
}

export default new EnderquestPlugin();

export { Server }