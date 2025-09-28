import { ShopVanillaEnchantTransactionPage } from "../../../../Classes/Shop/Pages/Form/VanillaEnchant/transaction";
import { CategoryBuilder } from "../../../../Classes/Shop/CategoryBuilder";


const ShopVanillaEnchantsCategory = new CategoryBuilder({ id: "vanillaEnchants", display: { name: "Vanilla Enchants" }, formatIds: false })
    .addItem({ id: "Efficiency", price: 12000, transactionType: ShopVanillaEnchantTransactionPage })
    .addItem({ id: "Unbreaking", price: 12000, transactionType: ShopVanillaEnchantTransactionPage })
    .addItem({ id: "Fortune", price: 12000, transactionType: ShopVanillaEnchantTransactionPage })
    .addItem({ id: "BaneOfArthropods", price: 12000, transactionType: ShopVanillaEnchantTransactionPage })
    .addItem({ id: "FireAspect", price: 12000, transactionType: ShopVanillaEnchantTransactionPage })
    .addItem({ id: "Looting", price: 12000, transactionType: ShopVanillaEnchantTransactionPage })
    .addItem({ id: "Smite", price: 12000, transactionType: ShopVanillaEnchantTransactionPage })
    .addItem({ id: "Sharpness", price: 12000, transactionType: ShopVanillaEnchantTransactionPage })

export { ShopVanillaEnchantsCategory };