import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Client, EmbedBuilder, TextChannel } from "discord.js"
import { Player } from "@serenityjs/core";
import { CustomSkin, GlobalDataManager } from "../Classes";
import { Utils } from "../Utils/utils";
import { FormApplication } from "./Applications/form";
import { Applications } from "./Applications/applications";
import { BOT_TOKEN, isDevEnvironment } from "../config";

export class DiscordClient {

    private static channels: { [key: string]: TextChannel } = {};

    public static headCache: Map<string, string> = new Map();

    private static commands: any[] = [];

    private static executions: { [key: string]: (interaction: ChatInputCommandInteraction) => any } = {};

    public static client = new Client({
        intents: [
            "Guilds",
            "GuildMembers",
            "GuildMessages",
            "MessageContent",
            "GuildMessageReactions",
            "DirectMessages"
        ],
    });

    public static async initialize() {
        this.client.once("clientReady", async () => {
            console.log(`Logged in as ${this.client.user?.tag}!`);

            // Register slash commands.
            this.client.application!.commands.set(this.commands);

            // Cache channels.
            this.channels = {
                logs: this.client.channels.cache.get(
                    "1422653138200170527"
                ) as TextChannel,
                dump: this.client.channels.cache.get(
                    "1420122602349006938"
                ) as TextChannel,
            };

            // Start interaction/command handler.
            this.onInteraction();
            // Log start.
            this.logStart();
            // Send pending embeds.
            import("./Embeds/index");

            // Make sure all current members have the guest role.
            const guild = this.client.guilds.cache.get("1420107089472262207")!;
            const role = guild.roles.cache.get('1420130564781903972')!;
            await guild.members.fetch();
            const members = guild.members.cache;
            for (const [_id, member] of members) {
                if (member.user.bot || member.roles.cache.has(role.id)) continue;
                member.roles.add(role);
            }
        });

        // Automatically apply the guest role.
        this.client.on("guildMemberAdd", member => {
            const role = member.guild.roles.cache.get('1420130564781903972')!;
            member.roles.add(role);
        })

        await import("./Commands/index")
        // Login
        this.client.login(BOT_TOKEN);
    }

    public static async disconnect() {
        await this.logStop();
        this.client.destroy();
        this.client = null!;
    }

    public static onInteraction() {
        this.client.on("interactionCreate", async (interaction) => {
            try {
                if (interaction.isCommand()) {
                    //if (isDevEnvironment) return;
                    const execution = this.executions[interaction.commandName];
                    if (execution) {
                        if (interaction.isChatInputCommand()) {
                            await execution(interaction);
                        }
                    }
                }
                else if (interaction.isStringSelectMenu()) {
                    if (interaction.customId === "application_select") {
                        const selected = interaction.values[0];
                        if (!selected) return;
                        // Check if player has already submitted an application.
                        const guild = this.client.guilds.cache.get("1420107089472262207")!;
                        const member = guild.members.cache.get(interaction.user.id);
                        if (member?.roles.cache.has("1422453759174377482")) {
                            interaction.reply({ content: "You are already a play tester.", flags: "Ephemeral" });
                            return;
                        }
                        new FormApplication(selected, interaction);
                    }
                }
                else if (interaction.isModalSubmit()) {
                    if (interaction.customId.startsWith("application_")) {
                        await interaction.reply({ content: "Your application has been submitted! Thank you for your interest and offer to help, it is much appreciated! 🙂", flags: "Ephemeral" });
                        const type = interaction.customId.replace("application_", "");
                        const ApplicationData = Applications.get(type);
                        if (!ApplicationData) return;
                        const embed = ApplicationData.submitEmbed?.(interaction, interaction.fields.fields.map((x) => {
                            return {
                                question: ApplicationData?.questions![parseInt(x.customId.substring(9))]!.question,
                                //@ts-ignore
                                answer: x.value
                            };
                        }));
                        const accept = new ButtonBuilder();
                        accept.setCustomId("tester_accept");
                        accept.setLabel("Accept");
                        accept.setStyle(ButtonStyle.Success);

                        const deny = new ButtonBuilder();
                        deny.setCustomId("tester_deny");
                        deny.setLabel("Deny");
                        deny.setStyle(ButtonStyle.Danger);

                        const row = new ActionRowBuilder().addComponents(accept, deny).toJSON();
                        if (type === "play_tester") {
                            (this.client.channels.cache.get("1422419850248196137") as TextChannel).send({ embeds: [embed!], components: [row] });
                        }
                    }
                }
                else if (interaction.isButton()) {
                    if (interaction.customId === "tester_accept") {
                        if (!interaction.memberPermissions?.has("ManageMessages")) {
                            interaction.reply({ content: "You do not have permission to do this.", flags: "Ephemeral" });
                            return;
                        }
                        const author = interaction.message.embeds[0]?.author!.name;
                        // Get user.
                        const username = author?.substring(0, author.indexOf(" ("));
                        const user = this.client.users.cache.find(u => u.username === username);
                        if (!user) {
                            interaction.reply({ content: "Could not find user.", flags: "Ephemeral" });
                            return;
                        }
                        // Add user to whitelist.
                        const gamertag = author?.substring(author.indexOf("(") + 1, author.indexOf(")"))!;
                        GlobalDataManager.instance.addToWhitelist(gamertag);

                        // Mark application as accepted.
                        const accepted = new ButtonBuilder();
                        accepted.setCustomId("tester_accepted");
                        accepted.setLabel("Accepted");
                        accepted.setStyle(ButtonStyle.Success);
                        accepted.setDisabled(true);

                        const row = new ActionRowBuilder().addComponents(accepted).toJSON();
                        interaction.message.edit({ components: [row] });

                        // Give play tester role.
                        const guild = this.client.guilds.cache.get("1420107089472262207")!;
                        const member = guild.members.cache.get(user.id);
                        if (!member) {
                            interaction.reply({ content: "Could not find user in guild.", flags: "Ephemeral" });
                            return;
                        }
                        member.roles.add("1422453759174377482");

                        // Send success message.
                        interaction.reply({ content: `\`✅\` **<@${user.id}> has been accepted as a play tester!**`, flags: "Ephemeral" });

                        // Send success embed.
                        const embed = new EmbedBuilder()
                            .setColor(10181046)
                            .setAuthor({
                                name: user.username,
                                iconURL: user.displayAvatarURL()
                            })
                            .setTitle("Application Accepted")
                            .setDescription(`You have been accepted into **early access**, welcome to the server! I really hope you enjoy your time playing. Please be sure to report any issues that you encounter during your experience.\n## What now?\n► Join the server: \`play.enderquest.me\`\n► Read the server rules: <#1420116331524522106>\n► Follow updates and changes: <#1420118855019397202>\n► Report issues by creating a ticket: <#1420119180086349944>\n► If you have any questions, feel free to reach out to a staff member.`)
                            .setTimestamp();
                        user.send({ embeds: [embed] });
                    } else if (interaction.customId === "tester_deny") {
                        if (!interaction.memberPermissions?.has("ManageMessages")) {
                            interaction.reply({ content: "You do not have permission to do this.", flags: "Ephemeral" });
                            return;
                        }
                        const author = interaction.message.embeds[0]?.author!.name;
                        // Get user.
                        const username = author?.substring(0, author.indexOf(" ("));
                        const user = this.client.users.cache.find(u => u.username === username);
                        if (!user) {
                            interaction.reply({ content: "Could not find user.", flags: "Ephemeral" });
                            return;
                        }

                        // Mark application as denied.
                        const denied = new ButtonBuilder();
                        denied.setCustomId("tester_denied");
                        denied.setLabel("Denied");
                        denied.setStyle(ButtonStyle.Danger);
                        denied.setDisabled(true);
                        const row = new ActionRowBuilder().addComponents(denied).toJSON();
                        interaction.message.edit({ components: [row] });
                        interaction.reply({ content: `\`❌\` **<@${user.id}> has been denied as a play tester.**`, flags: "Ephemeral" });

                        // Send denied embed.
                        const embed = new EmbedBuilder()
                            .setColor("Red")
                            .setAuthor({
                                name: user.username,
                                iconURL: user.displayAvatarURL()
                            })
                            .setTitle("Application Denied")
                            .setDescription(`Your application to join early access has been denied.\n\nI know this may be disappointing, but don't feel disheartened; it's unlikely that your application was the issue. As we finish the server, we are looking for people that check specific boxes to help us test certain features.\n\nWe do expect to open the server publicly in the very near future, so I hope that you will stick around until then.\n\nBest wishes, and thank you for your interest in our server. 🙂`)
                            .setTimestamp();
                        user.send({ embeds: [embed] });
                    }
                }
            } catch (e) {
                console.error("Error processing interaction:", e);
            }
        })
    }

    public static async dumpImage(id: string, buffer: Buffer<ArrayBufferLike>) {
        const message = await this.channels.dump!.send({ files: [buffer] });
        const url = Array.from(message.attachments)[0]![1].url
        this.headCache.set(id, url);
        return url;
    }

    public static async dumpHeadImage(player: Player) {
        const head = await CustomSkin.getHeadImage(player.xuid, await player.skin.getSkinImage());
        if (!head) return;
        return this.dumpImage(player.xuid, head);
    }

    public static getHeadImage(xuid: string) {
        return this.headCache.get(xuid);
    }

    public static async logPlayerJoin(player: Player) {
        if (!this.client || isDevEnvironment) return;
        const channel = this.channels.logs;
        if (!channel) return;
        const head = await this.dumpHeadImage(player)
        const embed = new EmbedBuilder().setAuthor({ iconURL: head, name: `${player.username} joined the server.` }).setColor("Green").setTimestamp();
        channel.send({ embeds: [embed] });
    }

    public static logPlayerLeave(player: Player) {
        if (!this.client || isDevEnvironment) return;
        const channel = this.channels.logs;
        if (!channel) return;
        const embed = new EmbedBuilder().setAuthor({ iconURL: this.getHeadImage(player.xuid), name: `${player.username} left the server.` }).setColor("Red").setTimestamp();
        channel.send({ embeds: [embed] });
    }

    public static logPlayerChat(message: string) {
        if (!this.client || isDevEnvironment) return;
        const channel = this.channels.logs;
        if (!channel) return;
        channel.send({ content: Utils.stripColorCodes(message) });
    }

    public static logStart() {
        if (!this.client || isDevEnvironment) return;
        const channel = this.channels.logs;
        if (!channel) return;
        const embed = new EmbedBuilder().setAuthor({ name: `✅ Server has started.` }).setColor("DarkGreen").setTimestamp();
        channel.send({ embeds: [embed] });
    }

    public static async logStop() {
        if (!this.client || isDevEnvironment) return;
        const channel = this.channels.logs;
        if (!channel) return;
        const embed = new EmbedBuilder().setAuthor({ name: `🔸 Restart in progress...` }).setColor("DarkOrange").setTimestamp();
        await channel.send({ embeds: [embed] });
    }

    public static registerCommand(command: any, execute: (interaction: ChatInputCommandInteraction) => any) {
        DiscordClient.commands.push(command);
        DiscordClient.executions[command.name] = execute;
        //console.debug("Registered: " + command.name);
    }
}

import { LinkManager } from "./Managers/link";
export { LinkManager };