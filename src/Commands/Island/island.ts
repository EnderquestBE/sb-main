import { CommandBuilder } from "../../Classes/classes";
import { IslandCreateCommand } from "./create";
import { IslandDeleteCommand } from "./delete";
import { IslandGoCommand } from "./go";
import { IslandRandomVisitCommand } from "./randomvisit";
import { IslandVisitCommand } from "./visit";

new CommandBuilder("island", "Create an island.").setAliases(["is", "skyblock", "sb"])
  .addOverload(IslandCreateCommand)
  .addOverload(IslandDeleteCommand)
  .addOverload(IslandGoCommand)
  .addOverload(IslandVisitCommand)
  .addOverload(IslandRandomVisitCommand)
  .register("Island")