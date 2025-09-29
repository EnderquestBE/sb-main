import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { DiscordClient } from "..";

const DiscordClearCommand = new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clears messages from the channel.")
    .addNumberOption((option) =>
        option
            .setName("amount")
            .setDescription("Number of messages to clear.")
            .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers);

async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({ content: "Attempted clear task.", flags: "Ephemeral" });
    const channel = interaction.channel;
    if (!channel) return;
    const amount = interaction.options.getNumber("amount", true);
    if (amount <= 0) return;
    const messages = await channel.messages.fetch({ limit: Math.min(amount, 100) });
    for (const message of messages) {
        try {
            await message[1].delete();
        } catch (error) { }
    }
}

DiscordClient.registerCommand(DiscordClearCommand, execute);