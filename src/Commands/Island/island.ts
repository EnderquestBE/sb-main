import { CommandBuilder } from "../../Classes";
import { IslandAcceptCommand } from "./accept";
import { IslandBanCommand } from "./ban";
import { IslandBankCommand } from "./bank";
import { IslandCreateCommand } from "./create";
import { IslandCropsCommand } from "./crops";
import { IslandDeclineCommand } from "./decline";
import { IslandDeleteCommand } from "./delete";
import { IslandDelHomeCommand } from "./delhome";
import { IslandDemoteCommand } from "./demote";
import { IslandDepositCommand } from "./deposit";
import { IslandExpandCommand } from "./expand";
import { IslandGoCommand } from "./go";
import { IslandHelpCommand } from "./help";
import { IslandHomeCommand } from "./home";
import { IslandHomesCommand, IslandHomesListCommand } from "./homes";
import { IslandInviteCommand } from "./invite";
import { IslandKickCommand } from "./kick";
import { IslandLeaveCommand } from "./leave";
import { IslandLimitCommand } from "./limit";
import { IslandListCommand } from "./list";
import { IslandLockCommand } from "./lock";
import { IslandMakeOwnerCommand } from "./makeowner";
import { IslandPerksCommand } from "./perks";
import { IslandPromoteCommand } from "./promote";
import { IslandRandomVisitCommand } from "./randomvisit";
import { IslandRemoveCommand } from "./remove";
import { IslandRenameCommand } from "./rename";
import { IslandSetHomeCommand } from "./sethome";
import { IslandSetSpawnCommand } from "./setspawn";
import { IslandStatsCommand } from "./stats";
import { IslandTopCommand } from "./top";
import { IslandTransferCommand } from "./transfer";
import { IslandUnbanCommand } from "./unban";
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
  .addOverload(IslandSetSpawnCommand)
  .addOverload(IslandLockCommand)
  .addOverload(IslandKickCommand)
  .addOverload(IslandBanCommand)
  .addOverload(IslandUnbanCommand)
  .addOverload(IslandRenameCommand)
  .addOverload(IslandInviteCommand)
  .addOverload(IslandAcceptCommand)
  .addOverload(IslandDeclineCommand)
  .addOverload(IslandRemoveCommand)
  .addOverload(IslandPromoteCommand)
  .addOverload(IslandDemoteCommand)
  .addOverload(IslandMakeOwnerCommand)
  .addOverload(IslandLeaveCommand)
  .addOverload(IslandTransferCommand)
  .addOverload(IslandHomeCommand)
  .addOverload(IslandSetHomeCommand)
  .addOverload(IslandHomesListCommand)
  .addOverload(IslandHomesCommand)
  .addOverload(IslandDelHomeCommand)
  .addOverload(IslandPerksCommand)
  .addOverload(IslandCropsCommand)
  .addOverload(IslandTopCommand)
  .addOverload(IslandListCommand)
  .addOverload(IslandGoCommand)

  .addOverload(IslandHelpCommand)
  .register("Island")