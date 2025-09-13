import { ItemIdentifier } from "@serenityjs/core";
import { CategoryBuilder } from "../../../../Classes/Shop/CategoryBuilder";

const ShopOresCategory = new CategoryBuilder({ id: "ores", display: { name: "Ores" } })
    .addItem({ id: ItemIdentifier.GoldIngot, price: 450, transactionSound: "dig.stone" })
    .addItem({ id: ItemIdentifier.IronIngot, price: 600, transactionSound: "dig.stone" })
    .addItem({ id: ItemIdentifier.Coal, price: 800, transactionSound: "dig.stone" })
    .addItem({ id: ItemIdentifier.LapisLazuli, price: 1750, transactionSound: "dig.stone" })
    .addItem({ id: ItemIdentifier.Diamond, price: 2500, transactionSound: "dig.stone" })

const ShopItemsCategory = new CategoryBuilder({ id: "items", display: { name: "Items" } })
    .addSubCategory(ShopOresCategory)
    .addItem({ id: ItemIdentifier.BoneMeal, price: 2250, transactionSound: "item.bone_meal.use" });

export { ShopItemsCategory };