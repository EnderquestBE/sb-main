import { EmbedBuilder, ModalSubmitInteraction, TextInputStyle } from "discord.js";

type ApplicationType = {
    name: string;
    status: "OPEN" | "CLOSED";
    description: string;
    link?: string;
    questions?: { question: string; type: TextInputStyle; min?: number, max?: number, required?: boolean }[];
    submitEmbed?: (interaction: ModalSubmitInteraction, responses: { question: string, answer: string }[]) => EmbedBuilder;
}

const Applications: Map<string, ApplicationType> = new Map([
    [
        "staff",
        {
            name: "Staff",
            status: "CLOSED",
            description: "You will help moderate the server and discord and assist players."
        }
    ],
    [
        "builder",
        {
            name: "Builder",
            status: "CLOSED",
            description: "You will be apart of a team that designs builds used on the server, such as the lobby and pvp arena each season.",
        },
    ],
    [
        "play_tester",
        {
            name: "Play Tester",
            status: "OPEN",
            description: "You will get early access to the server to help test gameplay, find bugs, and provide feedback.",
            questions: [
                { question: "What is your in-game username?", type: TextInputStyle.Short },
                { question: "How old are you?", type: TextInputStyle.Short, min: 1, max: 3 },
                { question: "What timezone are you in?", type: TextInputStyle.Short, min: 2, max: 50 },
                { question: "Have you played on a server like this before?", type: TextInputStyle.Paragraph, max: 1000 },
                { question: "Is there anything else you would like to add?", type: TextInputStyle.Paragraph, max: 1000 },
            ],
            submitEmbed: (interaction: ModalSubmitInteraction, responses: { question: string, answer: string }[]) => {
                const username = interaction.fields.getTextInputValue("question_0");
                return new EmbedBuilder()
                    .setColor(10181046)
                    .setAuthor({
                        name: `${interaction.user.username} (${username})`,
                        iconURL: interaction.user.displayAvatarURL()
                    })
                    .setTitle("Incoming Application")
                    .setDescription(responses.map(x => `► **Q: __${x.question}__**\n> **A:** ${x.answer}`).join("\n\n"))
                    .setTimestamp();
            }
        }
    ]
]);

export { Applications, ApplicationType };