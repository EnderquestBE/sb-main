import { Player } from "@serenityjs/core";
import { StashIdentifier } from "../../Types/Stashes/identifier";
import { CommonStash, DivineStash, EpicStash, LegendaryStash, RareStash, StashItem } from "../../Classes";
import { StashSelector } from "../../Configuration/Stash";

class StashHandler {
    private static stashChance = 0.001; // 1 in 1000 chance to find a stash of random rarity when mining.

    public static handleStashChance(player: Player, multiplier: number = 1) {
        if (Math.random() > this.stashChance * multiplier) return null;
        const stash = this.randomStash();
        if (!stash) return;
        this.giveStash(player, stash);
        player.info("§l§eYou found a §6Stash§e!");
    }

    public static randomStash() {
        const stash = StashSelector.select();
        if (!stash) return null;
        return stash;
    }

    public static giveStash(player: Player, stashType: StashIdentifier, amount: number = 1): void {
        let item: StashItem;
        switch (stashType) {
            case StashIdentifier.Common:
                item = new CommonStash(amount);
                break;
            case StashIdentifier.Rare:
                item = new RareStash(amount);
                break;
            case StashIdentifier.Epic:
                item = new EpicStash(amount);
                break;
            case StashIdentifier.Legendary:
                item = new LegendaryStash(amount);
                break;
            case StashIdentifier.Divine:
                item = new DivineStash(amount);
                break;
            default:
                player.error(`Invalid stash type: ${stashType}`);
                return;
        }
        player.inventory.addItem(item);
    }
}

export { StashHandler }