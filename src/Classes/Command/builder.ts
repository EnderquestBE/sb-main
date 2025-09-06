import { Dimension, Entity } from "@serenityjs/core";
import { Logger, LoggerColors } from "@serenityjs/logger";
import { CommandOverload } from "./overload";
import { FailureCallback } from "../../Types/types";
import { Server } from "../..";

/**
 * Used for class oriented command creation.
 *
 * This class handles the creation and registration of new commands.
 */
class CommandBuilder {
  private static readonly logger = new Logger("Commands", LoggerColors.Red)

  private static readonly unregisteredCommands: string[] = [];
  private static readonly registeredCommands: {
    [key: string]: CommandBuilder[];
  } = {};

  private name: string;
  private description: string;
  private overloads: CommandOverload<any>[] = [];
  private permissions: string[] = [];
  private debug: boolean = false;

  public onFail: FailureCallback = () => {
    throw new Error("Invalid arguments for command.");
  };

  /**
   * @param name Name and ID that will be used to access your command in-game.
   * @param description Short description that will show up alongside your command in-game.
   */
  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
    CommandBuilder.unregisteredCommands.push(name);
  }

  /**
   * Controls the use cases/executions of your command.
   */
  public addOverload(overload: CommandOverload<any>) {
    this.overloads.push(overload);
    return this;
  }

  /**
   * Optionally limits usage of this command to users with matching permission strings.
   */
  public setPermissions(permissions: string[]) {
    this.permissions = permissions;
    return this;
  }

  /**
   * Optionally identifies the command as a debug command (shows up blue in-game).
   */
  public setDebug(debug: boolean) {
    this.debug = debug;
    return this;
  }

  /**
   * Optionally runs this function if a matching overload cannot be found.
   */
  public setOnFail(callback: FailureCallback) {
    this.onFail = callback;
    return this;
  }

  /**
   * Registers your command to Serenity.
   */
  public register(category?: string) {
    // Register command.
    CommandBuilder.registeredCommands[category ?? "Miscellaneous"] ??= [];
    const categoryCommands =
      CommandBuilder.registeredCommands[category ?? "Miscellaneous"];
    categoryCommands!.push(this);
    // Remove from unregistered list.
    CommandBuilder.unregisteredCommands.splice(
      CommandBuilder.unregisteredCommands.indexOf(this.name),
      1
    );
  }

  /**
   * Registers all commands through server command registry.
   */
  public static registerAll(): void {
    // Warn when commands aren't registered correctly.
    for (let i = 0; i < this.unregisteredCommands.length; i++) {
      this.logger.warn(
        "§o§c/" +
        this.unregisteredCommands[i] +
        " §6has not been registered. Was this intentional?"
      );
    }
    for (const category of Object.keys(this.registeredCommands)) {
      const names: string[] = [];
      const commands = this.registeredCommands[category]?.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      if (!commands) continue;
      for (let command of commands) {
        Server.instance.commandPalette.register(
          command.name!,
          command.description!,
          (registry) => {
            registry.permissions = command.permissions;
            registry.debug = command.debug;

            for (const overload of command.overloads) {
              const executor = ({
                origin,
                ...params
              }: {
                origin: Dimension | Entity;
                [key: string]: any;
              }) => {
                return overload.execute(origin, params);
              };
              registry.overload(overload.parameters, executor);
            }
          },
          command.onFail
        );
        names.push(command.name);
      }
      this.logger.info(`-== ${category} §8(§c${names.length}§8)§r =--`);
      this.logger.info(`- §aRegistered: §b/${names.join(", /")}§r`);
    }
  }
}

export { CommandBuilder };
