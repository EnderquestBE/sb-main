import { ItemIdentifier, ItemStack } from "@serenityjs/core";
import { ByteTag, StringTag } from "@serenityjs/nbt";

abstract class ItemVoucher extends ItemStack {
    public static readonly identifier: ItemIdentifier;
    public static readonly type: string;

    constructor(identifier: ItemIdentifier, type: string, name: string) {
        super(identifier);
        this.setDisplayName(`§r${name} Voucher§r`);
        this.setLore([`§r§7Use to open!`]);
        this.nbt.set("Voucher", new StringTag(type, "Voucher"));
        this.getStorage().set("bypassInteract", new ByteTag(1, "bypassInteract"));
    }
}

export { ItemVoucher };