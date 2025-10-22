import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { DiscordClient } from "..";
import { GlobalDataManager } from "../../Classes/Data/Global";
import { WhitelistMode } from "../../Types/types";

const DiscordWhitelistCommand = new SlashCommandBuilder()
    .setName("whitelist")
    .setDescription("Manages the server whitelist.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addSubcommand(subcommand =>
        subcommand
            .setName("info")
            .setDescription("Shows the current whitelist settings.")
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName("mode")
            .setDescription("Sets the whitelist mode.")
            .addStringOption(option =>
                option
                    .setName("mode")
                    .setDescription("The whitelist mode.")
                    .setRequired(true)
                    .addChoices(
                        { name: "Closed", value: WhitelistMode.CLOSED },
                        { name: "Open", value: WhitelistMode.OPEN },
                        { name: "Allow", value: WhitelistMode.ALLOW },
                        { name: "Restricted", value: WhitelistMode.RESTRICTED }
                    )
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName("permission")
            .setDescription("Sets the required permission level for RESTRICTED mode.")
            .addIntegerOption(option =>
                option
                    .setName("level")
                    .setDescription("The new permission level.")
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName("add")
            .setDescription("Adds a user to the whitelist.")
            .addStringOption(option =>
                option
                    .setName("user")
                    .setDescription("The username to add.")
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName("remove")
            .setDescription("Removes a user from the whitelist.")
            .addStringOption(option =>
                option
                    .setName("user")
                    .setDescription("The username to remove.")
                    .setRequired(true)
            )
    );

async function execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
        case "info": {
            const globalDataManager = GlobalDataManager.instance;
            const { whitelistMode, permissionLevel, users } = globalDataManager;
            const infoEmbed = new EmbedBuilder()
                .setColor(10181046)
                .setTitle("Whitelist Information")
                .setDescription(`> **Mode:** \`${whitelistMode}\`\n> **Permission Level:** ${whitelistMode === "RESTRICTED" ? permissionLevel : `*${permissionLevel}*`}\n> **Whitelisted Users[${users.length}]:** ${users.length === 0 ? "..." : users.join(", ")}`)
                .setTimestamp()
                .setFooter({
                    text: "created by palm1",
                    iconURL:
                        "https://cdn.discordapp.com/avatars/358729136333783040/29ef94f30ab278c0b9bb88acfa5f0d1f.webp",
                });
            await interaction.reply({ embeds: [infoEmbed], flags: "Ephemeral" });
            break;
        }
        case "mode": {
            const mode = interaction.options.getString("mode", true) as WhitelistMode;
            const result = await GlobalDataManager.instance.setWhitelistMode(mode);

            if (result.success) {
                await interaction.reply({ content: `Whitelist mode has been set to **${mode}**.`, flags: "Ephemeral" });
            } else {
                await interaction.reply({ content: "Failed to set whitelist mode.", flags: "Ephemeral" });
            }
            break;
        }
        case "permission": {
            const level = interaction.options.getInteger("level", true);
            const globalDataManager = GlobalDataManager.instance;
            const result = await globalDataManager.setWhitelistPermissionLevel(level);

            if (result.success) {
                let replyMessage = `Whitelist permission level set to **${level}**.`;
                if (globalDataManager.whitelistMode !== WhitelistMode.RESTRICTED) {
                    replyMessage += `\n**Warning:** The whitelist mode is not currently set to RESTRICTED. This permission level will not take effect until the mode is changed.`;
                }
                await interaction.reply({ content: replyMessage, flags: "Ephemeral" });
            } else {
                await interaction.reply({ content: "Failed to set whitelist permission level.", flags: "Ephemeral" });
            }
            break;
        }
        case "add": {
            const user = interaction.options.getString("user", true);
            const result = await GlobalDataManager.instance.addToWhitelist(user);

            if (result.success) {
                await interaction.reply({ content: `Successfully whitelisted **${user}**.`, flags: "Ephemeral" });
            } else {
                await interaction.reply({ content: `Failed to whitelist **${user}**.`, flags: "Ephemeral" });
            }
            break;
        }
        case "remove": {
            const user = interaction.options.getString("user", true);
            const result = await GlobalDataManager.instance.removeFromWhitelist(user);
            if (result.success) {
                await interaction.reply({ content: `Successfully removed **${user}** from the whitelist.`, flags: "Ephemeral" });
            } else {
                await interaction.reply({ content: `Failed to remove **${user}** from the whitelist.`, flags: "Ephemeral" });
            }
            break;
        }
    }
}

DiscordClient.registerCommand(DiscordWhitelistCommand, execute);