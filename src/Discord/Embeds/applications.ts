import { ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextChannel } from "discord.js";
import { DiscordClient } from "..";
import { Applications } from "../Applications/applications";

const ApplicationDropdown = new StringSelectMenuBuilder()
    .setCustomId("application_select")
    .setPlaceholder("Select an application.")
    .addOptions(Applications.entries().toArray().filter(([_key, app]) => app.status === "OPEN").map(([key, app]) => (
        new StringSelectMenuOptionBuilder()
            .setLabel(app.name)
            .setDescription(app.description.substring(0, 100))
            .setValue(key)
    )));

const row = new ActionRowBuilder().addComponents(ApplicationDropdown).toJSON();

const applicationEmbed = new EmbedBuilder()
    .setColor(10181046)
    .setAuthor({
        name: "Enderquest",
        iconURL: "https://media.discordapp.net/attachments/1420122602349006938/1422376253591261225/enderquest-icon-purple.png?ex=68dc729d&is=68db211d&hm=669bed0a822bbba73ba6694b3c35d02dba8caefc1c03a5d57739b4dea0db09ce&=&format=webp&quality=lossless"
    })
    .setTitle("Applications")
    .setDescription(`__Select a type to submit an application for.__\n-# Keep in mind that even if an application is open, we still may not be quickly or actively accepting new people to the position. I can assure you, though, all applications are read and reviewed.
        \n${Applications.values().toArray().map(app => `► **${app.name} Application** [\`${app.status}\`]\n${app.status === "OPEN" ? app.description : "We are currently not looking for applicants for this position."}`).join("\n\n")}`)
    .setTimestamp(1759204800000);

//(DiscordClient.client.channels.cache.get("1420119434399580210") as TextChannel).send({ embeds: [applicationEmbed] });
(DiscordClient.client.channels.cache.get("1420119434399580210") as TextChannel).messages.fetch("1422431668366610525").then((msg) => msg.edit({ embeds: [applicationEmbed], components: [row] }));
