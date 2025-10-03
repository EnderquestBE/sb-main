import { ActionRowBuilder, CacheType, ModalBuilder, StringSelectMenuInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { Applications } from "./applications";

class FormApplication {
    constructor(type: string, interaction: StringSelectMenuInteraction<CacheType>) {
        const application = Applications.get(type);
        if (!application) console.error("User selected an invalid application type.");
        else {
            const modal = new ModalBuilder()
                .setCustomId('application_' + type)
                .setTitle(`${application.name} Application`);

            let i = 0;
            for (const question of application.questions!) {
                // Add components based on question type.
                switch (question.type) {
                    case TextInputStyle.Short:
                        modal.addComponents(
                            new ActionRowBuilder<TextInputBuilder>().addComponents(
                                new TextInputBuilder()
                                    .setCustomId('question_' + i++)
                                    .setLabel(question.question)
                                    .setStyle(TextInputStyle.Short)
                                    .setMinLength(question.min ?? 0)
                                    .setMaxLength(question.max ?? 400)
                                    .setRequired(question.required ?? true)
                            )
                        );
                        break;
                    case TextInputStyle.Paragraph:
                        modal.addComponents(
                            new ActionRowBuilder<TextInputBuilder>().addComponents(
                                new TextInputBuilder()
                                    .setCustomId('question_' + i++)
                                    .setLabel(question.question)
                                    .setStyle(TextInputStyle.Paragraph)
                                    .setMinLength(question.min ?? 0)
                                    .setMaxLength(question.max ?? 4000)
                                    .setRequired(question.required ?? true)
                            )
                        );
                        break;
                }
            }
            interaction.showModal(modal);
        }
    }
}

export { FormApplication };