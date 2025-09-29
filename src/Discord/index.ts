import { ChatInputCommandInteraction, Client, EmbedBuilder, TextChannel } from "discord.js"
import { BOT_TOKEN } from "./token";
import { Player } from "@serenityjs/core";
import { CustomSkin } from "../Classes";
import { Utils } from "../Utils/utils";

export class DiscordClient {

    private static channels: { [key: string]: TextChannel } = {};

    public static headCache: Map<string, string> = new Map();

    private static commands: any[] = [];

    private static executions: { [key: string]: (interaction: ChatInputCommandInteraction) => any } = {};

    public static client = new Client({
        intents: [
            "Guilds",
            "GuildMessages",
            "MessageContent",
            "GuildMessageReactions"
        ],
    });

    public static async initialize() {
        this.client.once("clientReady", () => {
            console.log(`Logged in as ${this.client.user?.tag}!`);

            // Register slash commands.
            this.client.application!.commands.set(this.commands);

            // Cache channels.
            this.channels = {
                logs: this.client.channels.cache.get(
                    "1420122836999344309"
                ) as TextChannel,
                dump: this.client.channels.cache.get(
                    "1420122602349006938"
                ) as TextChannel,
            };

            // Start interaction/command handler.
            this.onInteraction();
            // Log start.
            this.logStart();
        });

        await import("./Commands/index")

        // Login
        this.client.login(BOT_TOKEN);
    }

    public static async disconnect() {
        this.logStop();
        this.client.destroy();
        this.client = null!;
    }

    public static onInteraction() {
        this.client.on("interactionCreate", async (interaction) => {
            if (interaction.isCommand()) {
                const execution = this.executions[interaction.commandName];
                if (execution) {
                    if (interaction.isChatInputCommand()) {
                        await execution(interaction);
                    }
                }
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
        const head = await CustomSkin.getHeadImage(player.xuid, player.skin.skinImage);
        if (!head) return;
        return this.dumpImage(player.xuid, head);
    }

    public static getHeadImage(xuid: string) {
        return this.headCache.get(xuid);
    }

    public static async logPlayerJoin(player: Player) {
        if (!this.client) return;
        const channel = this.channels.logs;
        if (!channel) return;
        const head = await this.dumpHeadImage(player)
        const embed = new EmbedBuilder().setAuthor({ iconURL: head, name: `${player.username} joined the server.` }).setColor("Green").setTimestamp();
        channel.send({ embeds: [embed] });
    }

    public static logPlayerLeave(player: Player) {
        if (!this.client) return;
        const channel = this.channels.logs;
        if (!channel) return;
        const embed = new EmbedBuilder().setAuthor({ iconURL: this.getHeadImage(player.xuid), name: `${player.username} left the server.` }).setColor("Red").setTimestamp();
        channel.send({ embeds: [embed] });
    }

    public static logPlayerChat(message: string) {
        if (!this.client) return;
        const channel = this.channels.logs;
        if (!channel) return;
        channel.send({ content: Utils.stripColorCodes(message) });
    }

    public static logStart() {
        if (!this.client) return;
        const channel = this.channels.logs;
        if (!channel) return;
        const embed = new EmbedBuilder().setAuthor({ name: `✅ Server has started.` }).setColor("Green").setTimestamp();
        channel.send({ embeds: [embed] });
    }

    public static logStop() {
        if (!this.client) return;
        const channel = this.channels.logs;
        if (!channel) return;
        const embed = new EmbedBuilder().setAuthor({ name: `🔸 Restart in progress...` }).setColor("Red").setTimestamp();
        channel.send({ embeds: [embed] });
    }

    public static registerCommand(command: any, execute: (interaction: ChatInputCommandInteraction) => any) {
        DiscordClient.commands.push(command);
        DiscordClient.executions[command.name] = execute;
        //console.debug("Registered: " + command.name);
    }
}