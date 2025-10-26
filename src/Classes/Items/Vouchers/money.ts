import { CustomItemType, ItemIdentifier } from "@serenityjs/core";
import { ItemVoucher } from "./base";
import { ItemCustomVoucherTrait } from "../../../Traits/Item/traits";
import { IntTag } from "@serenityjs/nbt";
import { Utils } from "../../../Utils";

const MoneyVoucherType = new CustomItemType("voucher:money", { isComponentBased: true })
MoneyVoucherType.components.setIcon({ default: "map_empty" })
MoneyVoucherType.registerTrait(ItemCustomVoucherTrait)

class MoneyVoucher extends ItemVoucher {
    public static readonly identifier = MoneyVoucherType.identifier as ItemIdentifier;
    public static readonly type = "money";

    constructor(value: number, amount: number = 1) {
        super(
            MoneyVoucher.identifier,
            MoneyVoucher.type,
            "§6Money",
        );
        this.nbt.set("Value", new IntTag(value, "Value"));
        this.setLore(this.getLore().concat([`§r§dRedeems: §6$${Utils.formatInt(value)}`]));
        this.setStackSize(amount);
    }
}

export { MoneyVoucher, MoneyVoucherType };