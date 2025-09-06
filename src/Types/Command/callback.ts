import { CommandResponse, Dimension, Entity } from "@serenityjs/core";
import { CommandParameters, MappedParameters } from "./parameters";

type ExecuteCallback<T extends CommandParameters> = (
  origin: Dimension | Entity,
  params: MappedParameters<T>
) => CommandResponse | void

type FailureCallback = (origin: Dimension | Entity) => void;

export { ExecuteCallback, FailureCallback };
