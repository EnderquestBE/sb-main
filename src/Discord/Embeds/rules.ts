import { EmbedBuilder, TextChannel } from "discord.js";
import { DiscordClient } from "..";
import { SERVER_RULES } from "../../Configuration/config";

const discordRulesEmbed = new EmbedBuilder()
    .setColor(10181046)
    .setAuthor({
        name: "Enderquest",
        iconURL: "https://media.discordapp.net/attachments/1420122602349006938/1422376253591261225/enderquest-icon-purple.png?ex=68dc729d&is=68db211d&hm=669bed0a822bbba73ba6694b3c35d02dba8caefc1c03a5d57739b4dea0db09ce&=&format=webp&quality=lossless"
    })
    .setTitle("Discord Server Guidelines")
    .setDescription(`1. <:pepe_respect:1422388068090118186> │ **Be Respectful.**\n> Harassment, discrimination, and threats will not be tolerated. Moderate profanity is permitted if not aimed at other members. Do not post explicit or otherwise inappropriate content anywhere in the server or on your profile. Spamming and flooding is prohibited. 
2. <:growtopian:1422388078168903833> │ **Keep it Safe.**\n> Do not distribute malicious files or links. Do not use alternative accounts without explicit permission from staff. Do not request, share, or discuss personal information of other members. Do not solicit or advertise to other members, including in DMs.
3. <:huh:1422388055846944818> │ **Keep it Appropriate.**\n> Keep conversations on-topic and in appropriate channels if applicable. Avoid controversial topics. Please speak English in public text channels to ensure we can moderate effectively.
4. <:elmo_fire:1422389307775254628> │ **Do Not Act Disruptively.**\n> For help, open a ticket— do not ping or DM staff directly. Staff decisions are final; to report concerns regarding other members, including staff, please use the ticket system. Do not intentionally seek to cause drama or division.
5. <:pepe_king:1422388025828311132> │ **Use Common Sense.**\n> These rules are not comprehensive, and using loop holes or exploits to violate the spirit and intent of these guidelines will still resort in enforcement.`)
    .addFields({ name: "**GUIDELINES**", value: "Please note that Discord's [Community Guidelines](https://discord.com/guidelines) and [Terms of Service (TOS)](https://discord.com/terms) also apply to your conduct in this server, be aware of them.", inline: true })
    .addFields({ name: "**ENFORCEMENT**", value: "Punishment is determined on a case-by-case basis, but as a general rule of thumb, soft offenders will receive three warnings before being banned.", inline: true })
    .setTimestamp(1759201200000);

(DiscordClient.client.channels.cache.get("1420116331524522106") as TextChannel).messages.fetch("1422376764759605289").then((msg) => msg.edit({ embeds: [discordRulesEmbed] }));

const serverRulesEmbed = new EmbedBuilder()
    .setColor(10181046)
    .setAuthor({
        name: "Enderquest",
        iconURL: "https://media.discordapp.net/attachments/1420122602349006938/1422376253591261225/enderquest-icon-purple.png?ex=68dc729d&is=68db211d&hm=669bed0a822bbba73ba6694b3c35d02dba8caefc1c03a5d57739b4dea0db09ce&=&format=webp&quality=lossless"
    })
    .setTitle("Minecraft Server Rules")
    .setDescription(SERVER_RULES.map((rule, index) => `${index + 1}. ${rule}`).join("\n"))
    .addFields({ name: "**GUIDELINES**", value: "Please note that Minecraft's [EULA](https://www.minecraft.net/en-us/eula) also apply to your conduct on this server and others. Be sure to keep this in mind while playing.", inline: true })
    .addFields({ name: "**ENFORCEMENT**", value: "Punishment is determined on a case-by-case basis, but as a general rule of thumb, soft offenders will receive three warnings before being banned.", inline: true })
    .setTimestamp(1759201200000);

(DiscordClient.client.channels.cache.get("1420116331524522106") as TextChannel).messages.fetch("1422409011772395593").then((msg) => msg.edit({ embeds: [serverRulesEmbed] }));