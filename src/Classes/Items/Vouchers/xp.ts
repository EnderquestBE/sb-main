import { CustomItemType, ItemIdentifier } from "@serenityjs/core";
import { ItemVoucher } from "./base";
import { ItemCustomVoucherTrait } from "../../../Traits/Item/traits";
import { IntTag } from "@serenityjs/nbt";
import { Utils } from "../../../Utils";

const XPVoucherType = new CustomItemType("voucher:xp", { isComponentBased: true })
XPVoucherType.components.setIcon({ default: "map_empty" })
XPVoucherType.registerTrait(ItemCustomVoucherTrait)

class XPVoucher extends ItemVoucher {
    public static readonly identifier = XPVoucherType.identifier as ItemIdentifier;
    public static readonly type = "xp";

    constructor(value: number, amount: number = 1) {
        super(
            XPVoucher.identifier,
            XPVoucher.type,
            "§aXP",
        );
        this.nbt.set("Value", new IntTag(value, "Value"));
        this.setLore(this.getLore().concat([`§r§dRedeems: §a${Utils.formatInt(value)} XP`]));
        this.stackSize = amount;
    }
}

export { XPVoucher, XPVoucherType };