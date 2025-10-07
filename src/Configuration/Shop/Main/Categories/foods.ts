import { ItemIdentifier } from "@serenityjs/core";
import { CategoryBuilder } from "../../../../Classes/Shop/CategoryBuilder";

const ShopFoodsCategory = new CategoryBuilder({ id: "foods", display: { name: "Foods" } })
    .addItem({ id: ItemIdentifier.Apple, price: 250, transactionSound: "dig.wood" })
    .addItem({ id: ItemIdentifier.Cookie, price: 250, transactionSound: "dig.wood" })
    .addItem({ id: ItemIdentifier.Bread, price: 750, transactionSound: "dig.wood" })
    .addItem({ id: ItemIdentifier.BeetrootSoup, price: 2250, transactionSound: "dig.wood" })
    .addItem({ id: ItemIdentifier.MushroomStew, price: 3575, transactionSound: "dig.wood" })
    .addItem({ id: ItemIdentifier.RabbitStew, price: 5550, transactionSound: "dig.wood" })
    .addItem({ id: ItemIdentifier.PumpkinPie, price: 6500, transactionSound: "dig.wood" })
    .addItem({ id: ItemIdentifier.Pufferfish, price: 7000, transactionSound: "dig.wood" })
    //.addItem({ id: ItemIdentifier.Cake, price: 6250, transactionSound: "dig.wood" })
    .addItem({ id: ItemIdentifier.GoldenApple, price: 7500, transactionSound: "dig.wood" })
    .addItem({ id: ItemIdentifier.EnchantedGoldenApple, price: 250000, transactionSound: "dig.wood" });

export { ShopFoodsCategory };