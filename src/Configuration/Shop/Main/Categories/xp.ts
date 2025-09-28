import { SealedTome } from "../../../../Classes/Items/sealedTome";
import { EnchantmentRarity } from "../../../../Types/types";
import { CategoryBuilder } from "../../../../Classes/Shop/CategoryBuilder";

const ShopTomeCategory = new CategoryBuilder({ id: "tomes", display: { name: "CE Tomes" } })
    .addItem({ id: "Common Tome", item: new SealedTome(EnchantmentRarity.Common), price: 2500, currency: "xp", transactionSound: "item.book.page_turn" })
    .addItem({ id: "Rare Tome", item: new SealedTome(EnchantmentRarity.Rare), price: 5000, currency: "xp", transactionSound: "item.book.page_turn" })
    .addItem({ id: "Legendary Tome", item: new SealedTome(EnchantmentRarity.Legendary), price: 25000, currency: "xp", transactionSound: "item.book.page_turn" })
    .addItem({ id: "Exotic Tome", item: new SealedTome(EnchantmentRarity.Exotic), price: 500000, currency: "xp", transactionSound: "item.book.page_turn" });

const ShopScrollCategory = new CategoryBuilder({ id: "scrolls", display: { name: "Scrolls" } })

const ShopXPCategory = new CategoryBuilder({ id: "magic", display: { name: "§5Magic Items" }, formatIds: false })
    .addSubCategory(ShopScrollCategory)
    .addSubCategory(ShopTomeCategory)

export { ShopXPCategory, ShopScrollCategory };