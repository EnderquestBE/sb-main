import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { DiscordClient } from "..";
import { LinkManager } from "../Managers/link";
import { PlayerDatabase, PremiumDatabase } from "../../Classes";
import { RANKS } from "../../Configuration/config";

const DiscordUnlinkCommand = new SlashCommandBuilder()
    .setName("unlink")
    .setDescription("Unlinks your Minecraft account.");

async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ flags: 'Ephemeral' });
    // Check if the user is linked to an account.
    const premiumDB = PremiumDatabase.instance;
    const premiumData = await premiumDB.getByDiscordId(interaction.user.id);

    if (!premiumData) {
        await interaction.editReply({ content: "**\`You do not currently have a linked Minecraft account.\`**" });
        return;
    }

    const playerDB = PlayerDatabase.instance;
    const playerData = await playerDB.get(premiumData.xuid);

    if (!playerData) {
        await interaction.editReply({ content: "**\`You do not currently have an account on Enderquest.\`**" });
        return;
    }

    // Unlink discord ID.
    await premiumDB.updateOne(premiumData.xuid, { $unset: { discordId: "" } });

    const member = await interaction.guild!.members.fetch(interaction.user.id);

    // Update roles.
    for (const rankId of RANKS.keys()) {
        const info = RANKS.get(rankId);
        if (info && info.discordRoleId) {
            await member.roles.remove(info.discordRoleId).catch(() => { });
        }
    }

    await interaction.editReply({ content: `**\`✅ Unlinked account from ${playerData.username}\`**` });
}

DiscordClient.registerCommand(DiscordUnlinkCommand, execute);