import { ShopBuilder } from "../../../Classes/Shop";
import { ShopBlockCategory } from "./Categories/blocks";
import { ShopDecorationCategory } from "./Categories/decorations";
import { ShopEquipmentCategory } from "./Categories/equipment";
import { ShopFarmingCategory } from "./Categories/farming";
import { ShopFoodsCategory } from "./Categories/foods";
import { ShopItemsCategory } from "./Categories/items";
import { ShopSpawnersCategory } from "./Categories/spawners";
import { ShopVanillaEnchantsCategory } from "./Categories/vanillaEnchants";
import { ShopXPCategory } from "./Categories/xp";

const MainShop = new ShopBuilder("main", "Shop")
    .addCategory(ShopBlockCategory)
    .addCategory(ShopXPCategory)
    .addCategory(ShopDecorationCategory)
    .addCategory(ShopEquipmentCategory)
    .addCategory(ShopFarmingCategory)
    .addCategory(ShopFoodsCategory)
    .addCategory(ShopItemsCategory)
    .addCategory(ShopVanillaEnchantsCategory)
    .addCategory(ShopSpawnersCategory)

export { MainShop }