import { Player, Serenity } from "@serenityjs/core";
import { Logger, LoggerColors } from "@serenityjs/logger";
import { Multiplier } from "./Types/types";
import { GlobalDataManager } from "./Classes";

class Server {
    public static logger: Logger = new Logger("Enderquest", LoggerColors.LightPurple)

    private static PLAYER_COUNT = 0;

    private static multipliers: Multiplier[] = [];

    public static globalMultiplier: number = 1;

    public static instance: Serenity;

    public static initialize(instance: Serenity) {
        this.instance = instance;
    }

    public static initializeMultipliers() {
        this.multipliers = GlobalDataManager.instance.globalMultipliers;
        this.updateGlobalMultiplier();
    }

    public static updatePlayerCount() {
        this.PLAYER_COUNT = this.instance.players.size;
    }

    public static get playerCount(): number {
        return this.PLAYER_COUNT;
    }

    public static addMultiplier(multiplier: Multiplier) {
        GlobalDataManager.instance.addGlobalMultiplier(multiplier);
        this.multipliers.push(multiplier);
        this.updateGlobalMultiplier();
    }

    public static removeMultiplier(id: string) {
        GlobalDataManager.instance.removeGlobalMultiplier(id);
        this.multipliers = this.multipliers.filter(m => m.id !== id);
        this.updateGlobalMultiplier();
    }

    public static getMultipliers(): Multiplier[] {
        this.updateGlobalMultiplier();
        return this.multipliers;
    }

    public static addBoost(player: Player) {
        this.addMultiplier({
            id: `boost_${Math.random().toString(36).substring(2, 15)}`,
            factor: 0.1,
            name: `${player.username}'s Boost`,
            // Ends in 1 hour.
            endsAt: Date.now() + 60 * 60 * 1000
        })
    }

    public static queryMultipliers() {
        const multipliers = this.multipliers;
        for (const multiplier of multipliers) {
            // Check if the multiplier has expired.
            if (multiplier.endsAt && Date.now() >= multiplier.endsAt) {
                this.removeMultiplier(multiplier.id);
            }
        }
    }

    private static updateGlobalMultiplier() {
        this.globalMultiplier = this.multipliers.reduce((add, curr) => add + curr.factor, 1);
        this.queryMultipliers();
    }
}

export { Server }