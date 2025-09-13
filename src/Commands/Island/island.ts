import { CommandBuilder } from "../../Classes/classes";
import { IslandCreateCommand } from "./create";
import { IslandDeleteCommand } from "./delete";
import { IslandGoCommand } from "./go";
import { IslandLimitCommand } from "./limit";
import { IslandRandomVisitCommand } from "./randomvisit";
import { IslandStatsCommand } from "./stats";
import { IslandVisitCommand } from "./visit";

new CommandBuilder("island", "Create an island.").setAliases(["is", "skyblock", "sb"])
  .addOverload(IslandCreateCommand)
  .addOverload(IslandDeleteCommand)
  .addOverload(IslandVisitCommand)
  .addOverload(IslandRandomVisitCommand)
  .addOverload(IslandStatsCommand)
  .addOverload(IslandLimitCommand)

  .addOverload(IslandGoCommand)
  .register("Island")