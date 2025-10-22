import { ItemStackTrait, Player } from "@serenityjs/core";
import { IntTag, StringTag } from "@serenityjs/nbt";
import { Utils } from "../../../Utils";
import { VanityItems } from "../../../Configuration/Vanity";

const UseCooldown = new Map<string, number>();

class ItemCustomVoucherTrait extends ItemStackTrait {
    public static readonly identifier = "voucher";

    public onUseOnBlock(player: Player): void {
        if (UseCooldown.has(player.uuid)) {
            const lastUse = UseCooldown.get(player.uuid)!;
            if (lastUse > Date.now()) return;
        }
        UseCooldown.set(player.uuid, Date.now() + 200);
        // Check the voucher type of the item.
        const tag = this.item.nbt.get<StringTag>("Voucher");
        if (!tag) return;
        const voucherType = tag.valueOf();

        switch (voucherType) {
            case "money":
                const moneyTag = this.item.nbt.get<IntTag>("Value");
                const money = moneyTag?.valueOf();
                if (!money || money <= 0) {
                    player.error("This voucher is empty.");
                    return;
                }
                player.addMoney(money);
                player.sendMessage(`§aRedeemed §6$${Utils.formatInt(money)}§a.`);
                break;
            case "xp":
                const xpTag = this.item.nbt.get<IntTag>("Value");
                const xp = xpTag?.valueOf();
                if (!xp || xp <= 0) {
                    player.error("This voucher is empty.");
                    return;
                }
                player.addXp(xp);
                player.sendMessage(`§aRedeemed §d${Utils.formatInt(xp)}§a XP.`);
                break;
            case "vanity":
                const vanityTag = this.item.nbt.get<StringTag>("VanityID");
                const vanityID = vanityTag?.valueOf();
                if (!vanityID) {
                    player.error("This voucher is invalid.");
                    return;
                }
                const info = VanityItems.get(vanityID);
                if (!info) {
                    player.error("This voucher is invalid.");
                    return;
                }
                // Check if player already owns the vanity item.
                if (player.ownsVanity(vanityID)) {
                    player.error(`You already own this vanity item!`);
                    return;
                }
                // Unlock the vanity.
                player.unlockVanity(vanityID);
                player.sendMessage(`§eUnlocked vanity §d${info.name}§e.`);
                break;
        }
        this.item.decrementStack();
    }
}

export { ItemCustomVoucherTrait }