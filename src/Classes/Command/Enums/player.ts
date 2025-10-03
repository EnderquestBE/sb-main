import { CustomEnum, PlayerCommandExecutorTrait, Serenity } from "@serenityjs/core";

class PlayerEnum extends CustomEnum {
    public static readonly identifier: string = "player"
    public static options: string[] = []

    public static update(serenity: Serenity) {
        const players = serenity.getPlayers();
        this.options = players.map(x => x.username);
        for (const player of players) {
            const trait = player.getTrait(PlayerCommandExecutorTrait);
            trait.sendAvailableCommands();
        }
    }
}

export { PlayerEnum }