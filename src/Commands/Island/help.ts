import { CustomEnum, Entity, ActionForm, ModalForm, Player } from "@serenityjs/core";
import { CommandOverload } from "../../Classes";

class IslandHelpEnum extends CustomEnum {
    public static readonly identifier = "islandHelp";
    public static options = ["help"];
}

type MappedIslandCommand = { name: string, params: { name: string, type: string, optional: boolean }[] }

var IslandCommands: MappedIslandCommand[] = [];

function registerIslandHelpCommands(commands: MappedIslandCommand[]) {
    IslandCommands = commands;
}

const IslandHelpCommand = new CommandOverload({
    help: IslandHelpEnum,
}).onCallback((origin) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return;
    const player = origin;

    const form = new ActionForm("Island Help");
    form.content = "Select an island command from the list to execute it.";

    for (const subcommand of IslandCommands) {
        form.button(`/is ${subcommand.name}`);
    }

    function showMainForm() {
        form.show(player, (result, error) => {
            if (error || result === null) return;

            const selectedCommand = IslandCommands[result];
            if (!selectedCommand) return;

            if (selectedCommand.params.length === 0) {
                player.executeCommand(`island ${selectedCommand.name}`);
            } else {
                showArgumentForm(player, selectedCommand);
            }
        });
    }

    function showArgumentForm(player: Player, commandInfo: MappedIslandCommand) {
        const modal = new ModalForm(`/is ${commandInfo.name}`);

        for (const param of commandInfo.params) {
            modal.input(param.name + (param.optional ? " §7(Optional)" : ""), param.type);
        }

        modal.show(player, (modalResult, modalError) => {
            if (modalError || modalResult === null) return showMainForm();

            // Filter out empty arguments and wrap arguments with spaces in quotes
            const args = (modalResult as string[]).map(arg => {
                const trimmed = arg.trim();
                return trimmed.includes(' ') ? `"${trimmed}"` : trimmed;
            }).filter(arg => arg.length > 0 && arg !== '""');

            const commandArgs = args.length > 0 ? ` ${args.join(" ")}` : "";

            player.executeCommand(`island ${commandInfo.name}${commandArgs}`);
        });
    }

    showMainForm();
});

export { IslandHelpCommand, registerIslandHelpCommands };