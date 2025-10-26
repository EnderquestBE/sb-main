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
        answer: "Absolutely! To make it as easy as possible for you to join from console, you can join our realm that acts as a 'portal' to the main server!\n**Realm Code:** https://realms.gg/WqQbAQyYiLBDP9k"
    },
    {
        question: "When will the server release?",
        answer: "We plan to release in beta to to the public by the end of 2025! Stay tuned for exciting updates on that in this discord server!"
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
    .setTimestamp(1761516000000);

(DiscordClient.client.channels.cache.get("1420117563773423686") as TextChannel).messages.fetch("1422415096671371344").then((msg) => msg.edit({ embeds: [faqEmbed] }));