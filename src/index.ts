import { Plugin, PluginEvents, PluginPriority } from "@serenityjs/plugins";
import { LevelDBProvider, StringEnum, VoidGenerator, WorldEvent } from "@serenityjs/core";

class EnderquestMain extends Plugin implements PluginEvents {
  public readonly priority: PluginPriority = PluginPriority.Low;

  public constructor() {
    super("ender-quest", "0.0.1+indev");
  }

  public onInitialize(): void {
    this.logger.info("§5Ender§dquest§r has been initialized.");
    this.serenity.on(WorldEvent.WorldInitialize, ({ world }) => {
      world.commandPalette.register(
        "create",
        "Create a new world.",
        (registry) => {
          registry.overload(
            {
              identifier: StringEnum,
            },
            async ({ identifier }) => {
              // Check if identifier is provided
              if (!identifier.result) throw new Error("Identifier is required");

              // Create a new world with the specified identifier
              const world = await this.serenity.createWorld(LevelDBProvider, {
                identifier: identifier.result,
                dimensions: [
                  {
                    identifier: "overworld",
                    generator: VoidGenerator.identifier,
                  }
                ]
              });
              return {
                message: "World created successfully."
              }
            }
          )
        },
        () => {
          return {
            message: "World failed to create."
          }
        }
      )
    })
  }

  public onStartUp(): void {
    this.logger.info("§5Ender§dquest§r has started.");
  }

  public onShutDown(): void {
    this.logger.info("§5Ender§dquest§r has stopped safely.");
  }
}

export default new EnderquestMain();

export { EnderquestMain }
