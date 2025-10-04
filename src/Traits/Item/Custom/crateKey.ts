import { ItemStackTrait, ItemStackUseOnBlockOptions, Player } from "@serenityjs/core";
import { StringTag } from "@serenityjs/nbt";
import { CrateIdentifier } from "../../../Types/types";
import { CommonCrateSelector, DivineCrateSelector, EpicCrateSelector, LegendaryCrateSelector, RareCrateSelector, SeasonalCrateSelector } from "../../../Configuration/Crate";
import { Utils } from "../../../Utils";
import { VoterCrateSelector } from "../../../Configuration/Crate/voter";

const UseCooldown = new Map<string, number>();

class ItemCustomCrateKeyTrait extends ItemStackTrait {
    public static readonly identifier = "crate_key";

    public onAdd(): void {
        const expires = this.item.nbt.get<StringTag>("Expires");
        if (expires) {
            this.updateExpiration(expires.valueOf());
        }
    }

    public onUseOnBlock(player: Player, { targetBlock }: ItemStackUseOnBlockOptions): void {
        if (UseCooldown.has(player.uuid)) {
            const lastUse = UseCooldown.get(player.uuid)!;
            if (lastUse > Date.now()) return;
        }
        UseCooldown.set(player.uuid, Date.now() + 200);
        // Check if the item has a crate type.
        const tag = this.item.nbt.get<StringTag>("Crate");
        if (!tag) return;
        const crateType = tag.valueOf();

        // Check if the block is a crate.
        const blockCrateType = targetBlock.getStorageEntry<StringTag>("Crate")?.valueOf();
        if (!blockCrateType) {
            // Display expiration if it is a seasonal key.
            if (crateType === CrateIdentifier.Seasonal) {
                const expires = this.item.nbt.get<StringTag>("Expires")?.valueOf();
                if (expires) this.displayExpiration(player, expires);
            }
            return;
        }

        if (crateType !== blockCrateType) {
            player.error(`This key can only be used on a ${crateType} crate.`);
            return;
        }

        // Check if the key is expired.
        const expires = this.item.nbt.get<StringTag>("Expires")?.valueOf();
        if (expires) {
            const expireTime = new Date(expires).getTime();
            const now = Date.now();
            if (expireTime < now) {
                player.error(`Sorry, this key has expired.`);
                return;
            }
        }

        // Open the crate.
        this.openCrate(player, crateType as CrateIdentifier);
    }

    private openCrate(player: Player, type: CrateIdentifier) {
        let LootSelector;
        switch (type) {
            case "Common":
                LootSelector = CommonCrateSelector;
                break;
            case "Rare":
                LootSelector = RareCrateSelector;
                break;
            case "Epic":
                LootSelector = EpicCrateSelector;
                break;
            case "Legendary":
                LootSelector = LegendaryCrateSelector;
                break;
            case "Divine":
                LootSelector = DivineCrateSelector;
                break;
            case "Voter":
                LootSelector = VoterCrateSelector;
                break;
            case "Seasonal":
                LootSelector = SeasonalCrateSelector;
                break;
            default:
                player.error("This crate key cannot be used.");
                return;
        }
        const loot = LootSelector.select();
        if (!loot) return player.error("This crate key cannot be used.");
        this.item.decrementStack();
        const amount = Array.isArray(loot.amount) ? Math.floor(Math.random() * (loot.amount[1] - loot.amount[0] + 1)) + loot.amount[0] : (loot.amount || 1);
        const display = loot.function(player, amount);
        player.info(`§dUsed ${this.item.getDisplayName()}§d... §eYou received ${display}§e!`);
    }

    private displayExpiration(player: Player, expires: string) {
        const expireTime = new Date(expires).getTime();
        const now = Date.now();
        if (expireTime < now) player.info(`§cSorry, this key has expired.`);
        else player.info(`§dThis key will expire in: §c${Utils.formatDuration(Math.ceil((expireTime - now) / 1000))}`);
    }

    public updateExpiration(expires: string) {
        const lore: string[] = [this.item.getLore()[0]!];
        const expireTime = new Date(expires).getTime();
        const now = Date.now();
        if (expireTime < now) {
            this.item.setLore(lore.concat([`§r§c§lExpired`]));
        } else {
            const timeLeft = Math.floor((expireTime - now) / 1000);
            let timeString: string;
            if (timeLeft >= 86400) {
                const days = Math.floor(timeLeft / 86400)
                timeString = `${days} day${days > 1 ? "s" : ""}`;
            } else if (timeLeft >= 3600) {
                const hours = Math.floor(timeLeft / 3600);
                timeString = `${hours} hour${hours > 1 ? "s" : ""}`;
            } else {
                const minutes = Math.floor(timeLeft / 60);
                timeString = `${minutes} minute${minutes > 1 ? "s" : ""}`;
            }
            this.item.setLore(lore.concat([`§r§cExpires in: ${timeString}`]));
        }
    }
}

export { ItemCustomCrateKeyTrait }