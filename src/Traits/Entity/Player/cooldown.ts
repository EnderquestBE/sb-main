import { CommandExecutionState, EntityEquipmentTrait, EntityIdentifier, Player, PlayerTrait } from "@serenityjs/core"
import { Vector3f } from "@serenityjs/protocol";
import { ServerTaskHandler } from "../../../Handlers";

class PlayerCommandCooldownTrait extends PlayerTrait {
    public static readonly identifier = "command-cooldown"

    public static readonly types = [EntityIdentifier.Player]

    declare public entity: Player;

    private static readonly COMMAND_COOLDOWN = 2250;

    private static readonly EXEMPT_COMMANDS = new Set([
        "spawn",
        "sellhand",
        "sh",
        "sellhandxp",
        "shxp",
        "compress",
        "break",
        "breaker"
    ])

    private nextCommand = 0;

    public onCommand(state: CommandExecutionState): boolean | void {
        if (!state.command) return false;
        //@ts-ignore
        if (this.player._commandCooldown !== true) {
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
        }
        return true;
    }

    public onJump(): void {
        // Talaria CE check.
        const armor = this.player.getTrait(EntityEquipmentTrait).armor;
        const boots = armor.getItem(3);
        if (boots && boots.isCustomEnchanted()) {
            const enchantments = boots.getCustomEnchantments();
            const talaria = enchantments?.find((x) => x.id === "talaria");
            if (!talaria) return;
            const { level, info } = talaria;
            const chance = info.activationChance;
            const effectiveChance = Math.max(chance.base - (level * chance.perLevel), chance.minimum);
            if (Math.random() * effectiveChance <= 1) {
                ServerTaskHandler.queueTask(() => {
                    this.player.applyImpulse(new Vector3f(0, 0.08 * level, 0));
                }, 150);
            }
        }
    }
}

export { PlayerCommandCooldownTrait }