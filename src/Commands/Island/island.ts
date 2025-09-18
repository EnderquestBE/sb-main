import { CommandBuilder } from "../../Classes/classes";
import { IslandBankCommand } from "./bank";
import { IslandCreateCommand } from "./create";
import { IslandDeleteCommand } from "./delete";
import { IslandDepositCommand } from "./deposit";
import { IslandExpandCommand } from "./expand";
import { IslandGoCommand } from "./go";
import { IslandLimitCommand } from "./limit";
import { IslandRandomVisitCommand } from "./randomvisit";
import { IslandStatsCommand } from "./stats";
import { IslandVisitCommand } from "./visit";
import { IslandWithdrawCommand } from "./withdraw";

new CommandBuilder("island", "Create an island.").setAliases(["is", "skyblock", "sb"])
  .addOverload(IslandCreateCommand)
  .addOverload(IslandDeleteCommand)
  .addOverload(IslandVisitCommand)
  .addOverload(IslandRandomVisitCommand)
  .addOverload(IslandStatsCommand)
  .addOverload(IslandLimitCommand)
  .addOverload(IslandWithdrawCommand)
  .addOverload(IslandDepositCommand)
  .addOverload(IslandExpandCommand)
  .addOverload(IslandBankCommand)
  .addOverload(IslandGoCommand)
  .register("Island")