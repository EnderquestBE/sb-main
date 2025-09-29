import { AttachmentBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { DiscordClient } from "..";
import { CustomSkin, PlayerDatabase } from "../../Classes";
import { Server } from "../../server";
import { ServerTaskHandler } from "../../Handlers/Server/handler";
import { Utils } from "../../Utils/utils";
import { RANKS } from "../../Configuration/config";

const DiscordPlayerCommand = new SlashCommandBuilder()
    .setName("lookup")
    .setDescription("Shows information about a player.")
    .addStringOption((option) =>
        option
            .setName("username")
            .setDescription("Player username to lookup.")
            .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers);

async function execute(interaction: ChatInputCommandInteraction) {
    return new Promise<void>(async (resolve) => {
        const username = interaction.options.getString("username", true);
        const data = await PlayerDatabase.instance.getByUsername(username);
        if (!data) {
            interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("Player not found.")
                    .setDescription(
                        "This player does not have a record on the server.\nCheck to make sure you have the correct name."
                    )
                    .setTimestamp()
                    .setFooter({
                        text: "created by palm1",
                        iconURL:
                            "https://cdn.discordapp.com/avatars/358729136333783040/29ef94f30ab278c0b9bb88acfa5f0d1f.webp",
                    })], flags: "Ephemeral"
            });
            return;
        }
        // Cache player data.
        const { xuid, activeRanks, island, timePlayed, lastSeen, firstSeen, balance: { money, xp }, } = data;
        // Get head image.
        const player = Server.instance.getPlayerByXuid(xuid);
        const headImage = await CustomSkin.getHeadImage(xuid, player?.skin.skinImage);
        const ownerHead = new AttachmentBuilder(headImage ?? "https://mc-heads.net/avatar/jeb_/256", { name: `${username.replace(/\s/g, "")}.png` });
        // Create embed body.
        const line1 = `> **Balance:** $${Utils.formatInt(money)}\n> **XP:** ${xp}\n> **Rank:** ${activeRanks.reverse().map((x) => `[${RANKS.get(x)!.name}]`).join("")}\n> **Island:** ${island === "" ? "--" : island}\n> **Time Played:** ${Utils.formatDuration(timePlayed)}\n> **K:** 0 **D:** 0 **R:** 0`.toString();
        const infoEmbed = new EmbedBuilder()
            .setColor(10181046)
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.avatarURL() ?? "",
            })
            .setThumbnail("attachment://" + ownerHead.name)
            .addFields(
                { name: `\`[${player ? "🟢|ONLINE" : "🔴|OFFLINE"}]\` **${username}**`.toString(), value: line1 },
                { name: `**Last Seen:** <t:${Math.floor(lastSeen.getTime() / 1000)}:R>\n**First Seen:** <t:${Math.floor(firstSeen.getTime() / 1000)}:R>`.toString(), value: "" }
            )
            .setTimestamp()
            .setFooter({
                text: "created by palm1",
                iconURL:
                    "https://cdn.discordapp.com/avatars/358729136333783040/29ef94f30ab278c0b9bb88acfa5f0d1f.webp",
            });

        // Send embed.
        let resolved = false;
        await interaction.deferReply();
        ServerTaskHandler.queueTask(async () => {
            try {
                if (resolved) return;
                await interaction.editReply({ embeds: [infoEmbed] });
            } catch (e) { }
            resolve();
        }, 5000);
        try {
            await interaction.editReply({ embeds: [infoEmbed], files: [ownerHead] });
            resolved = true;
        } catch (e) { }
        resolve();
    })
}

DiscordClient.registerCommand(DiscordPlayerCommand, execute);