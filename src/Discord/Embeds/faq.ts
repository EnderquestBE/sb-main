import { EmbedBuilder, TextChannel } from "discord.js";
import { DiscordClient } from "..";

const Questions = [
    {
        question: "What is this place?",
        answer: "Enderquest is a Skyblock server for Minecraft: Bedrock Edition!"
    },
    {
        question: "How can I join?",
        answer: "The server is currently in early-access as we work on features, balancing, and fixing bugs. If you are interested in play-testing, you **can** apply to join! https://discord.com/channels/1420107089472262207/1420119434399580210"
    },
    {
        question: "Can I play on console?",
        answer: "If you are apart of the early-access group, we have not implemented an official route for console players to join *yet*, though we definitely will when the server is publicly released. In the interim, you can still join using third-party software such as **Bedrock Connect**."
    },
    {
        question: "When will the server release?",
        answer: "The server is already in a playable state, but we want to ensure a stable experience before officially releasing. We don't know for sure how long this will take, but we are hoping to be able to open for our first official season within a month or two."
    }
]

const faqEmbed = new EmbedBuilder()
    .setColor(10181046)
    .setAuthor({
        name: "Enderquest",
        iconURL: "https://media.discordapp.net/attachments/1420122602349006938/1422376253591261225/enderquest-icon-purple.png?ex=68dc729d&is=68db211d&hm=669bed0a822bbba73ba6694b3c35d02dba8caefc1c03a5d57739b4dea0db09ce&=&format=webp&quality=lossless"
    })
    .setTitle("Frequent Questions")
    .setDescription(Questions.map(q => `► **Q: __${q.question}__**\n> **A:** ${q.answer}`).join("\n\n"))
    .setTimestamp(1759201200000);

(DiscordClient.client.channels.cache.get("1420117563773423686") as TextChannel).messages.fetch("1422415096671371344").then((msg) => msg.edit({ embeds: [faqEmbed] }));