import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { DiscordClient } from "..";
import { Server } from "../../server";

const DiscordPlayerListCommand = new SlashCommandBuilder()
    .setName("playerlist")
    .setDescription("Shows a list of players that are currently online.")
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers);

async function execute(interaction: ChatInputCommandInteraction) {
    const players = Server.instance.getPlayers();
    if (players.length === 0) {
        await interaction.reply({ content: "There are no players online." });
        return;
    } else if (players.length === 1) {
        await interaction.reply({ content: `There is currently 1 player online: \`${players[0]!.username}\`` });
    } else await interaction.reply({ content: `There are currently ${players.length} players online: ${players.map(p => `\`${p.username}\``).join(", ")}` });
}

DiscordClient.registerCommand(DiscordPlayerListCommand, execute);