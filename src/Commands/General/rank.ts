import { CustomEnum, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";
import { DEFAULT_PREMIUM_DATA, PlayerRank, RANKS } from "../../Configuration/config";
import { Utils } from "../../Utils";
import { Kit } from "../../Configuration/Kit";

class RankEnum extends CustomEnum {
    public static readonly identifier = "allRanks"
    public static options = RANKS.entries().toArray().filter((x) => x[1].description).map(([key]) => key);
}

new CommandBuilder("rank", "Shows perks for a rank.")
    .setAliases(["helprank"])
    .addOverload(
        new CommandOverload({
            rank: RankEnum
        }).onCallback((player, { rank: rankRaw }) => {
            if (!(player instanceof Player)) return;

            const rankId = rankRaw.result as PlayerRank;
            const rankInfo = RANKS.get(rankId);
            if (!rankInfo || !rankInfo.description) {
                return player.error("Rank not found.");
            }

            let description = `§fDescription: §7${rankInfo.description}`;
            if (rankInfo.permissions.length > 0) description += `\n§aCommands:\n${rankInfo.permissions.map((x) => `§a - §2/${x.replace("rank.", "")}`).join("\n")}`;
            const slots = Object.entries(rankInfo.slots);
            if (slots.length > 0) description += `\n§cSlots:\n${slots.map(([slot, amount]) => `§5 - §d${Utils.formatString(slot)}: §f${DEFAULT_PREMIUM_DATA.slots[slot as keyof typeof DEFAULT_PREMIUM_DATA.slots] + amount}`).join("\n")}`;
            const kit = Kit.get(rankId.toLowerCase());
            if (kit) description += `\n§6Kit: §f${kit.displayName}`;

            player.sendMessage("§f------------------")
            player.sendMessage(`§bRank: §d${rankInfo.displayName}`);
            player.sendMessage(description);
            player.sendMessage("§f------------------")
        })
    )
    .register("General");