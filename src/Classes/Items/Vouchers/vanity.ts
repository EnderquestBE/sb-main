import { CustomItemType, ItemIdentifier } from "@serenityjs/core";
import { ItemVoucher } from "./base";
import { ItemCustomVoucherTrait } from "../../../Traits/Item/traits";
import { StringTag } from "@serenityjs/nbt";
import { VanityItems } from "../../../Configuration/Vanity";

const VanityVoucherType = new CustomItemType("voucher:vanity", {
  isComponentBased: true,
});
VanityVoucherType.components.setIcon({ default: "record_13" });
VanityVoucherType.registerTrait(ItemCustomVoucherTrait);

class VanityVoucher extends ItemVoucher {
  public static readonly identifier =
    VanityVoucherType.identifier as ItemIdentifier;
  public static readonly type = "vanity";

  constructor(id: string, amount: number = 1) {
    super(VanityVoucher.identifier, VanityVoucher.type, "§eVanity");
    const info = VanityItems.get(id);
    if (info) {
      this.nbt.set("VanityID", new StringTag(id, "VanityID"));
      this.setLore(this.getLore().concat([`§r§6Unlocks: §d${info.name}`]));
      this.setStackSize(amount);
    }
  }
}

export { VanityVoucher, VanityVoucherType };
