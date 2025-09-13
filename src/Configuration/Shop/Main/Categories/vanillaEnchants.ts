import { CategoryBuilder } from "../../../../Classes/Shop/CategoryBuilder";
import { ShopVanillaEnchantTransactionPage } from "../../../../Classes/Shop/Pages/Form/VanillaEnchant/transaction";

const ShopVanillaEnchantsCategory = new CategoryBuilder({ id: "vanillaEnchants", display: { name: "Vanilla Enchants" }, formatIds: false })
    .addItem({ id: "Efficiency", price: 12000, transactionType: ShopVanillaEnchantTransactionPage })
    .addItem({ id: "Unbreaking", price: 12000, transactionType: ShopVanillaEnchantTransactionPage })
    .addItem({ id: "Fortune", price: 12000, transactionType: ShopVanillaEnchantTransactionPage })

export { ShopVanillaEnchantsCategory };