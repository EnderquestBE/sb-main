import { CommandExecutionState, EntityIdentifier, EntityTrait, Player } from "@serenityjs/core"

class PlayerCommandCooldownTrait extends EntityTrait {
    public static readonly identifier = "command-cooldown"

    public static readonly types = [EntityIdentifier.Player]

    declare public entity: Player;

    private static readonly COMMAND_COOLDOWN = 2250;

    private static readonly EXEMPT_COMMANDS = new Set([
        "spawn",
        "sellhand",
        "sh",
        "sellhandxp",
        "shxp"
    ])

    private nextCommand = 0;

    public onCommand(state: CommandExecutionState): boolean | void {
        if (!state.command) return false;
        if (PlayerCommandCooldownTrait.EXEMPT_COMMANDS.has(state.command.name)) return true;
        // Implement cooldown.
        if (this.nextCommand > Date.now()) {
            this.entity.info(
                `§cYou are on cooldown. Please wait §4${Math.ceil(
                    (this.nextCommand - Date.now()) / 1000
                )} §cseconds.`,
            )
            return false;
        }
        this.nextCommand = Date.now() + PlayerCommandCooldownTrait.COMMAND_COOLDOWN;
        return true;
    }
}

export { PlayerCommandCooldownTrait }