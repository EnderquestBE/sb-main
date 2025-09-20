import { ShopBuilder } from "../../../Classes/Shop/ShopBuilder";
import { ShopBlockCategory } from "./Categories/blocks";
import { ShopDecorationCategory } from "./Categories/decorations";
import { ShopEquipmentCategory } from "./Categories/equipment";
import { ShopFarmingCategory } from "./Categories/farming";
import { ShopFoodsCategory } from "./Categories/foods";
import { ShopItemsCategory } from "./Categories/items";
import { ShopSpawnersCategory } from "./Categories/spawners";
import { ShopVanillaEnchantsCategory } from "./Categories/vanillaEnchants";

const MainShop = new ShopBuilder("main", "Shop")
    .addCategory(ShopBlockCategory)
    // "Black Market" XP Shop
    .addCategory(ShopDecorationCategory)
    .addCategory(ShopEquipmentCategory)
    .addCategory(ShopFarmingCategory)
    .addCategory(ShopFoodsCategory)
    .addCategory(ShopItemsCategory)
    .addCategory(ShopVanillaEnchantsCategory)
    .addCategory(ShopSpawnersCategory)

export { MainShop }