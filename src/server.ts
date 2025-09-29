import { Serenity } from "@serenityjs/core";
import { Logger, LoggerColors } from "@serenityjs/logger";

class Server {
    public static logger: Logger = new Logger("Enderquest", LoggerColors.LightPurple)

    private static PLAYER_COUNT = 0;

    public static instance: Serenity;

    public static initialize(instance: Serenity) {
        this.instance = instance;
    }

    public static incrementPlayerCount() {
        this.PLAYER_COUNT++;
    }

    public static decrementPlayerCount() {
        if (this.PLAYER_COUNT > 0) {
            this.PLAYER_COUNT--;
        }
    }

    public static get playerCount(): number {
        return this.PLAYER_COUNT;
    }
}

export { Server }