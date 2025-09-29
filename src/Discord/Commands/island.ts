import { AttachmentBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { DiscordClient } from "..";
import { CustomSkin, Island, IslandLevel } from "../../Classes";
import { Server } from "../../server";
import { ServerTaskHandler } from "../../Handlers/Server/handler";
import { IslandLimitType } from "../../Types/types";
import { Utils } from "../../Utils/utils";

const DiscordIslandCommand = new SlashCommandBuilder()
    .setName("island")
    .setDescription("Shows information about an island.")
    .addStringOption((option) =>
        option
            .setName("name")
            .setDescription("Island name to view.")
            .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers);

async function execute(interaction: ChatInputCommandInteraction) {
    return new Promise<void>(async (resolve) => {
        const name = interaction.options.getString("name", true);
        const island = await Island.load(name);
        if (!island) {
            interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("Island not found.")
                    .setDescription(
                        "The island you are looking for does not exist.\nCheck to make sure you have the correct name."
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
        // Cache island data.
        const { owner, founder, level, points, bank, coowners, admins, helpers, homes, size, limits } = island.getData();
        const currentLevel = IslandLevel.fromPoints(points);

        // Get head image.
        const player = Server.instance.getPlayerByXuid(owner.xuid);
        const headImage = await CustomSkin.getHeadImage(owner.xuid, player?.skin.skinImage);
        const ownerHead = new AttachmentBuilder(headImage ?? "https://mc-heads.net/avatar/jeb_/256", { name: `${owner.username.replace(/\s/g, "")}.png` });
        // Create embed body.
        const line1 = `> **Owner:** ${owner.username
            }\n> **Founder:** ${founder.username}\n> **Co-Owners**[${coowners.length}/${limits.coowners.max}]**:** ${coowners.length === 0
                ? "..."
                : Object.values(coowners)
                    .filter((x) => {
                        x.username !== owner.username;
                    })
                    .map((x) => x.username)
                    .join(", ")
            }\n> **Admins**[${admins.length}]**:** ${admins.length === 0
                ? "..."
                : Object.values(admins)
                    .map((x) => x.username)
                    .join(", ")
            }\n> **Helpers**[${helpers.length}/${limits.members.max}]**:** ${helpers.length === 0
                ? "..."
                : Object.values(helpers)
                    .map((x) => x.username)
                    .join(", ")
            }\n> **Homes**[${homes.length}/${limits.homes.max}]**:** ${homes.length === 0
                ? "..."
                : Object.values(homes)
                    .map((x) => x.name)
                    .join(", ")
            }`.toString();
        const line2 =
            `Level: **${level}**  |  Points: **${points - IslandLevel.toPoints(currentLevel - 1)}**/**${150 * currentLevel}**  |  Size: **${size} Blocks**\nBank: **$${bank}/$${Utils.formatIntToFixed(limits.bank.max, 1)}**`.toString();
        const infoEmbed = new EmbedBuilder()
            .setColor(10181046)
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.avatarURL() ?? "",
            })
            .setThumbnail("attachment://" + ownerHead.name)
            .addFields(
                { name: `**\`[${island.isOnline() ? "🟢|ONLINE" : "🔴|OFFLINE"}]\` ${name}**`.toString(), value: line1 },
                { name: "", value: `————————————————————————\n${line2}\n————————————————————————`.toString() }
            )
            .setTimestamp()
            .setFooter({
                text: "created by palm1",
                iconURL:
                    "https://cdn.discordapp.com/avatars/358729136333783040/29ef94f30ab278c0b9bb88acfa5f0d1f.webp",
            });
        const limitKeys: IslandLimitType[] = ["spawners", "hoppers", "crops"]
        for (let key of limitKeys) {
            const { amount, max } = limits[key];
            infoEmbed.addFields({
                name:
                    key.charAt(0).toUpperCase() + key.substring(1),
                value: `${amount} / ${max}`,
                inline: true,
            });
        }
        // Ensure the number of fields is a multiple of three
        const remainder = limitKeys.length % 3;
        if (remainder !== 0) {
            for (let i = 0; i < 3 - remainder; i++) {
                infoEmbed.addFields({
                    name: "\u200B",
                    value: "\u200B",
                    inline: true,
                });
            }
        }

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

DiscordClient.registerCommand(DiscordIslandCommand, execute);