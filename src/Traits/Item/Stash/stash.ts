import { ItemStackTrait, Player } from "@serenityjs/core";
import { StringTag } from "@serenityjs/nbt";
import { CommonStashSelector, DivineStashSelector, EpicStashSelector, LegendaryStashSelector, RareStashSelector } from "../../../Configuration/Stash";

class ItemCustomStashTrait extends ItemStackTrait {
    public static readonly identifier = "item_stash";

    private cooldown: number = 0;

    public onUseOnBlock(player: Player): void {
        if (this.cooldown > Date.now()) return;
        this.cooldown = Date.now() + 300;
        const rarity = this.item.nbt.get<StringTag>("Stash")?.valueOf();
        if (!rarity) return;
        let LootSelector;
        switch (rarity) {
            case "Common":
                LootSelector = CommonStashSelector;
                break;
            case "Rare":
                LootSelector = RareStashSelector;
                break;
            case "Epic":
                LootSelector = EpicStashSelector;
                break;
            case "Legendary":
                LootSelector = LegendaryStashSelector;
                break;
            case "Divine":
                LootSelector = DivineStashSelector;
                break;
            default:
                player.error("This stash cannot be opened.");
                return;
        }
        const loot = LootSelector.select();
        if (!loot) return player.error("This stash cannot be opened.");
        this.item.decrementStack();
        const amount = Array.isArray(loot.amount) ? Math.floor(Math.random() * (loot.amount[1] - loot.amount[0] + 1)) + loot.amount[0] : (loot.amount || 1);
        const display = loot.function(player, amount);
        player.info(`§dOpening stash... §eYou received ${display}§e!`);
    }
}

export { ItemCustomStashTrait }