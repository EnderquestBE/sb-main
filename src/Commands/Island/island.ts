import { CommandBuilder } from "../../Classes/classes";
import { IslandCreateCommand } from "./create";
import { IslandDeleteCommand } from "./delete";
import { IslandGoCommand } from "./go";

new CommandBuilder("island", "Create an island.").setAliases(["is", "skyblock", "sb"])
  .addOverload(IslandCreateCommand)
  .addOverload(IslandDeleteCommand)
  .addOverload(IslandGoCommand)
  .register("Island")