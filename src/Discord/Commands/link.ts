import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { DiscordClient } from "..";
import { LinkManager } from "../Managers/link";
import { PlayerDatabase, PremiumDatabase } from "../../Classes";
import { RANKS } from "../../Configuration/config";
import { Server } from "../../server";

const DiscordLinkCommand = new SlashCommandBuilder()
    .setName("link")
    .setDescription("Links your Minecraft account.")
    .addStringOption((option) =>
        option
            .setName("code")
            .setDescription("In-game verification code from /link.")
            .setRequired(false)
    );

async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ flags: 'Ephemeral' });
    // Check code.
    const code = interaction.options.getString("code", false)?.toUpperCase();
    if (code) {
        const xuid = LinkManager.checkCode(code);

        if (!xuid) {
            await interaction.editReply({ content: "**\`Invalid or expired code.\`**" });
            return;
        }

        // Get premium and player data.
        const premiumDB = PremiumDatabase.instance;
        const premiumData = await premiumDB.getByXUID(xuid);
        if (!premiumData) {
            await interaction.editReply({ content: "**\`You do not currently have an account on Enderquest.\`**" });
            return;
        }

        const playerDB = PlayerDatabase.instance;
        const playerData = await playerDB.get(xuid);
        if (!playerData) {
            await interaction.editReply({ content: "**\`You do not currently have an account on Enderquest.\`**" });
            return;
        }

        // Link discord ID.
        await premiumDB.updateOne(xuid, { $set: { discordId: interaction.user.id } });

        // Add exclusive vanity item.
        const player = Server.instance.getPlayerByXuid(xuid);
        const ownsVanity = player?.ownsVanity("discord_tee") ?? premiumData.vanity.includes("discord_tee");
        if (!ownsVanity) {
            if (player) {
                player.unlockVanity("discord_tee");
            } else {
                await premiumDB.updateOne(xuid, { $addToSet: { vanity: "discord_tee" } });
            }
        }

        const username = playerData.username;

        // Update roles.
        const member = await interaction.guild!.members.fetch(interaction.user.id);
        for (const rankId of premiumData.ranks) {
            const info = RANKS.get(rankId);
            if (info && info.discordRoleId) {
                await member.roles.add(info.discordRoleId).catch(() => { });
            }
        }

        // Update nickname.
        member.setNickname(username, "In-game username verification.").catch(() => { });

        await interaction.editReply({ content: `**\`✅ Linked account to ${username}\`**` });

        // Send confirmation if player is online.
        if (player) {
            player.info(`§bYour account §7(§9${interaction.user.username}§7) §bhas been §asuccessfully §blinked!`);
            if (!ownsVanity)
                player.info("§eYou have unlocked the §9Discord Tee §evanity item! §6Equip it using §d/wardrobe§6.")
        }
    } else {
        // Get premium and player data.
        const premiumDB = PremiumDatabase.instance;
        const premiumData = await premiumDB.getByDiscordId(interaction.user.id);
        if (!premiumData) {
            await interaction.editReply({ content: "**\`Your account is not currently linked to a Minecraft account.\`**" });
            return;
        }

        const xuid = premiumData.xuid;

        const playerDB = PlayerDatabase.instance;
        const playerData = await playerDB.get(xuid);
        if (!playerData) {
            await interaction.editReply({ content: "**\`You do not currently have an account on Enderquest.\`**" });
            return;
        }

        // Check if the player is already linked. If so, just update their information.
        if (premiumData.discordId && premiumData.discordId !== "") {
            const username = playerData.username;

            // Update roles.
            const member = await interaction.guild!.members.fetch(interaction.user.id);
            for (const rankId of premiumData.ranks) {
                const info = RANKS.get(rankId);
                if (info && info.discordRoleId) {
                    await member.roles.add(info.discordRoleId).catch(() => { });
                }
            }

            // Update nickname.
            member.setNickname(username, "In-game username verification.").catch(() => { });
            await interaction.editReply({ content: `**\`✅ Updated from account ${username}\`**` });
            return;
        }
    }
}

DiscordClient.registerCommand(DiscordLinkCommand, execute);