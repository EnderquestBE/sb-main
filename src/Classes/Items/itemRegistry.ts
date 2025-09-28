import { World } from "@serenityjs/core";
import * as Scrolls from "./Scrolls"
import * as Stashes from "./Stashes"
import { ShopScrollCategory, ShopXPCategory } from "../../Configuration/Shop/Main/Categories/xp";
import { MainShop } from "../../Configuration/Shop/Main/main";

const ScrollTypes = [Scrolls.BindingScrollType, Scrolls.ExpulsionScrollType, Scrolls.MasteryScrollType, Scrolls.RefinementScrollType, Scrolls.RestorationScrollType, Scrolls.TemperamentScrollType];
const StashTypes = [Stashes.CommonStashType, Stashes.RareStashType, Stashes.EpicStashType, Stashes.LegendaryStashType, Stashes.DivineStashType];

class CustomItemRegistry {
    public static readonly types = [...ScrollTypes, ...StashTypes];

    public static registerAll(world: World) {
        world.itemPalette.registerType(...this.types);
        // Add custom items to the shop.
        ShopScrollCategory.addItem({ id: "Binding Scroll", item: new Scrolls.BindingScroll(), price: 15000, currency: "xp", transactionSound: "item.book.page_turn" })
        ShopScrollCategory.addItem({ id: "Refinement Scroll", item: new Scrolls.RefinementScroll(), price: 20000, currency: "xp", transactionSound: "item.book.page_turn" })
        ShopScrollCategory.addItem({ id: "Mastery Scroll", item: new Scrolls.MasteryScroll(), price: 25000, currency: "xp", transactionSound: "item.book.page_turn" })
        ShopScrollCategory.addItem({ id: "Expulsion Scroll", item: new Scrolls.ExpulsionScroll(), price: 25000, currency: "xp", transactionSound: "item.book.page_turn" })
        ShopScrollCategory.addItem({ id: "Temperament Scroll", item: new Scrolls.TemperamentScroll(), price: 20000, currency: "xp", transactionSound: "item.book.page_turn" })
        ShopScrollCategory.addItem({ id: "Restoration Scroll", item: new Scrolls.RestorationScroll(), price: 15000, currency: "xp", transactionSound: "item.book.page_turn" });
        // Add custom item categories to the shop.
        MainShop.updateCategory(ShopXPCategory)
        // Initialize shop instances.
        MainShop.initialize()
    }
}

export { CustomItemRegistry }