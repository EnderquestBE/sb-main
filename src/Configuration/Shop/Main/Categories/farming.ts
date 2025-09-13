import { ItemIdentifier } from "@serenityjs/core";
import { CategoryBuilder } from "../../../../Classes/Shop/CategoryBuilder";

const ShopFarmingCategory = new CategoryBuilder({ id: "farming", display: { name: "Farming" } })
    .addItem({ id: ItemIdentifier.BeetrootSeeds, price: 75, transactionSound: "dig.wood" })
    .addItem({ id: ItemIdentifier.WheatSeeds, price: 125, transactionSound: "dig.wood" })
    .addItem({ id: ItemIdentifier.Carrot, price: 185, transactionSound: "dig.wood" })
    .addItem({ id: ItemIdentifier.Potato, price: 195, transactionSound: "dig.wood" })
    .addItem({ id: ItemIdentifier.PumpkinSeeds, price: 225, transactionSound: "dig.wood" })
    .addItem({ id: ItemIdentifier.MelonSeeds, price: 275, transactionSound: "dig.wood" })

export { ShopFarmingCategory };