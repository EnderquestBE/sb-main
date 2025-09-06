import { Plugin, PluginEvents } from "@serenityjs/plugins";
import { Server } from "./server";

class EnderquestPlugin extends Plugin implements PluginEvents {

  public constructor() {
    super("enderquest", "0.0.1+indev");
  }

  public onInitialize(): void {
    Server.initialize(this.serenity)
  }

  public onStartUp(): void {
    this.logger.info("§5Ender§dquest§r has started.");
  }

  public onShutDown(): void {
    this.logger.info("§5Ender§dquest§r has stopped safely.");
  }
}

export default new EnderquestPlugin();