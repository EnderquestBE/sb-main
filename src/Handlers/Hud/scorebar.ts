import { Player, ScoreboardIdentity } from "@serenityjs/core";
import { DisplaySlotType, ObjectiveSortOrder, RemoveObjectivePacket, ScoreboardActionType, ScoreboardIdentityType, ScoreEntry, SetDisplayObjectivePacket, SetScorePacket } from "@serenityjs/protocol";
import { Island, IslandLevel } from "../../Classes";
import { Utils } from "../../Utils/utils";
import { Server } from "../../server";

class Scorebar {
    public static TITLE = "§l§dEnder§eQuest §bSB";
    public static DISCORD = "§➲   §d» §9discord.ender.quest §d«";
    private static readonly S_GT = " §d➲ §bGT: §f";
    private static readonly S_PLAYERS = " §d➲ §ePlayers: §f";
    private static readonly S_BALANCE = " §d➲ §6Balance: §f$";
    private static readonly S_XP = " §d➲ §cXP: §f";
    private static readonly S_PING = " §d➲ §3Ping: §f";
    private static readonly S_ISLAND_STATS = "§b❖ Island Stats ❖";
    private static readonly S_ISLAND_NAME = " §b匚 §eIsland: §f";
    private static readonly S_ISLAND_OWNER = " §b匚 §6Owner: §f";
    private static readonly S_ISLAND_BANK = " §b匚 §cBank: §f$";
    private static readonly S_ISLAND_LEVEL = " §b匚 §aLevel: §f";
    private static readonly S_ISLAND_POINTS = " §b匚 §2Points: §f";
    private static readonly S_ISLAND_SIZE = " §b匚 §dSize: §f";
    private static readonly S_YOUR_STATS = "§b❖ Your Stats ❖";
    private static readonly S_RANK = " §b匚 §aRank: ";
    private static readonly S_TIME = " §b匚 §6Time: §f";
    private static readonly S_KDR = " §b匚 §cK: §f0 §9D: §f0 §5R: §f0";
    private static readonly S_TIP_ISLAND = "§d➤ §7Try using §6/is help§7.";
    private static readonly S_TIP_HUB = "§d➤ §7Use §6/hud §7to disable.";
    private static readonly S_NO_ISLAND = " §b匚 §2Island: §f§e/is create";
    private static readonly S_NO_LEVEL = " §b匚 §eLevel: §f--";

    public static update(player: Player, island: Island | null) {
        // Generate random objective id.
        const objective = Math.random().toString(36).substring(2, 9);

        // Create display packet.
        const displayPacket = new SetDisplayObjectivePacket();
        displayPacket.displaySlot = DisplaySlotType.Sidebar;
        displayPacket.objectiveName = objective;
        displayPacket.displayName = this.TITLE;
        displayPacket.criteriaName = "dummy";
        displayPacket.sortOrder = ObjectiveSortOrder.Descending;

        const scores: ScoreEntry[] = [];
        let scoreIndex = 13;

        scores.push({ scoreboardId: ScoreboardIdentity.IDENTIFIER++, objectiveName: objective, score: scoreIndex--, identityType: ScoreboardIdentityType.FakePlayer, actorUniqueId: null, customName: this.DISCORD });
        scores.push({ scoreboardId: ScoreboardIdentity.IDENTIFIER++, objectiveName: objective, score: scoreIndex--, identityType: ScoreboardIdentityType.FakePlayer, actorUniqueId: null, customName: `${this.S_GT}${player.username}` });
        scores.push({ scoreboardId: ScoreboardIdentity.IDENTIFIER++, objectiveName: objective, score: scoreIndex--, identityType: ScoreboardIdentityType.FakePlayer, actorUniqueId: null, customName: `${this.S_PLAYERS}${Server.playerCount}§7/§f20` });
        scores.push({ scoreboardId: ScoreboardIdentity.IDENTIFIER++, objectiveName: objective, score: scoreIndex--, identityType: ScoreboardIdentityType.FakePlayer, actorUniqueId: null, customName: `${this.S_BALANCE}${Utils.formatInt(player.getMoney())}` });
        scores.push({ scoreboardId: ScoreboardIdentity.IDENTIFIER++, objectiveName: objective, score: scoreIndex--, identityType: ScoreboardIdentityType.FakePlayer, actorUniqueId: null, customName: `${this.S_XP}${Utils.formatInt(player.getTotalXp())}` });

        if (player.isWorldIsland() && island) {
            scores.push({ scoreboardId: ScoreboardIdentity.IDENTIFIER++, objectiveName: objective, score: scoreIndex--, identityType: ScoreboardIdentityType.FakePlayer, actorUniqueId: null, customName: this.S_ISLAND_STATS });
            scores.push({ scoreboardId: ScoreboardIdentity.IDENTIFIER++, objectiveName: objective, score: scoreIndex--, identityType: ScoreboardIdentityType.FakePlayer, actorUniqueId: null, customName: `${this.S_ISLAND_NAME}${island.getName()}` });
            scores.push({ scoreboardId: ScoreboardIdentity.IDENTIFIER++, objectiveName: objective, score: scoreIndex--, identityType: ScoreboardIdentityType.FakePlayer, actorUniqueId: null, customName: `${this.S_ISLAND_OWNER}${island.getOwner().username}` });
            scores.push({ scoreboardId: ScoreboardIdentity.IDENTIFIER++, objectiveName: objective, score: scoreIndex--, identityType: ScoreboardIdentityType.FakePlayer, actorUniqueId: null, customName: `${this.S_ISLAND_BANK}${Utils.formatInt(island.getBankBalance())}` });
            scores.push({ scoreboardId: ScoreboardIdentity.IDENTIFIER++, objectiveName: objective, score: scoreIndex--, identityType: ScoreboardIdentityType.FakePlayer, actorUniqueId: null, customName: `${this.S_ISLAND_LEVEL}${island.getLevel()}` });

            const totalPoints = island.getPoints();
            const currentLevel = IslandLevel.fromPoints(totalPoints);
            const pointsForLevel = totalPoints - IslandLevel.toPoints(currentLevel - 1);
            const pointsNeeded = 150 * currentLevel;
            scores.push({ scoreboardId: ScoreboardIdentity.IDENTIFIER++, objectiveName: objective, score: scoreIndex--, identityType: ScoreboardIdentityType.FakePlayer, actorUniqueId: null, customName: `${this.S_ISLAND_POINTS}${pointsForLevel}§7/§f${pointsNeeded}` });

            scores.push({ scoreboardId: ScoreboardIdentity.IDENTIFIER++, objectiveName: objective, score: scoreIndex--, identityType: ScoreboardIdentityType.FakePlayer, actorUniqueId: null, customName: `${this.S_ISLAND_SIZE}${island.getSize()} Blocks` });
            scores.push({ scoreboardId: ScoreboardIdentity.IDENTIFIER++, objectiveName: objective, score: scoreIndex--, identityType: ScoreboardIdentityType.FakePlayer, actorUniqueId: null, customName: this.S_TIP_ISLAND });
        } else {
            //@ts-ignore
            scores.push({ scoreboardId: ScoreboardIdentity.IDENTIFIER++, objectiveName: objective, score: scoreIndex--, identityType: ScoreboardIdentityType.FakePlayer, actorUniqueId: null, customName: `${this.S_PING}${player.connection.ping}ms` });
            scores.push({ scoreboardId: ScoreboardIdentity.IDENTIFIER++, objectiveName: objective, score: scoreIndex--, identityType: ScoreboardIdentityType.FakePlayer, actorUniqueId: null, customName: this.S_YOUR_STATS });
            scores.push({ scoreboardId: ScoreboardIdentity.IDENTIFIER++, objectiveName: objective, score: scoreIndex--, identityType: ScoreboardIdentityType.FakePlayer, actorUniqueId: null, customName: `${this.S_RANK}${player.getPrimaryRank().displayName}` });

            if (island) {
                scores.push({ scoreboardId: ScoreboardIdentity.IDENTIFIER++, objectiveName: objective, score: scoreIndex--, identityType: ScoreboardIdentityType.FakePlayer, actorUniqueId: null, customName: `${this.S_ISLAND_NAME}${island.getName()}` });
                scores.push({ scoreboardId: ScoreboardIdentity.IDENTIFIER++, objectiveName: objective, score: scoreIndex--, identityType: ScoreboardIdentityType.FakePlayer, actorUniqueId: null, customName: `${this.S_ISLAND_LEVEL}${island.getLevel()}` });
            } else {
                scores.push({ scoreboardId: ScoreboardIdentity.IDENTIFIER++, objectiveName: objective, score: scoreIndex--, identityType: ScoreboardIdentityType.FakePlayer, actorUniqueId: null, customName: this.S_NO_ISLAND });
                scores.push({ scoreboardId: ScoreboardIdentity.IDENTIFIER++, objectiveName: objective, score: scoreIndex--, identityType: ScoreboardIdentityType.FakePlayer, actorUniqueId: null, customName: this.S_NO_LEVEL });
            }
            scores.push({ scoreboardId: ScoreboardIdentity.IDENTIFIER++, objectiveName: objective, score: scoreIndex--, identityType: ScoreboardIdentityType.FakePlayer, actorUniqueId: null, customName: `${this.S_TIME}${Utils.formatDuration(player.getTimePlayed())}` });
            scores.push({ scoreboardId: ScoreboardIdentity.IDENTIFIER++, objectiveName: objective, score: scoreIndex--, identityType: ScoreboardIdentityType.FakePlayer, actorUniqueId: null, customName: this.S_KDR });
            scores.push({ scoreboardId: ScoreboardIdentity.IDENTIFIER++, objectiveName: objective, score: scoreIndex--, identityType: ScoreboardIdentityType.FakePlayer, actorUniqueId: null, customName: this.S_TIP_HUB });
        }

        const scorePacket = new SetScorePacket();
        scorePacket.type = ScoreboardActionType.Change;
        scorePacket.entries = scores;

        player.send(displayPacket, scorePacket);
        //@ts-ignore
        player._lastScoreboardId = objective;
    }

    public static clear(player: Player) {
        const packet = new RemoveObjectivePacket();
        //@ts-ignore
        packet.objectiveName = player._lastScoreboardId;

        player.send(packet);
    }
}

export { Scorebar }