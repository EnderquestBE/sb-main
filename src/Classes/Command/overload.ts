import { CommandParameters, ExecuteCallback } from "../../Types/types";

/**
 * Used for class oriented overload creation.
 *
 * This class handles the creation of overloads that can be used in the command builder.
 */
class CommandOverload<T extends CommandParameters> {
  /**
   * The parameters/arguments available for this overload.
   */
  public readonly parameters: T;
  /**
   * Callback to execute when this overload is ran.
   */
  public execute: ExecuteCallback<T> = () => {
    return { message: "This command does not have any functionality yet." };
  };

  public constructor(parameters: T) {
    this.parameters = parameters;
  }

  /**
   * Sets the callback function to execute when this overload is ran.
   * @param callback Function to run.
   */
  onCallback(callback: ExecuteCallback<T>) {
    this.execute = callback;
    return this;
  }
}

export { CommandOverload };
