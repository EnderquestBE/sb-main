import { Player } from "@serenityjs/core";
import { ShopCategory, ShopCurrency, ShopData, ShopItem } from "../../Types/types";
import { ShopFormPage } from "./Pages/Form/main";
import { ShopPage } from "./Pages/page";
import { Shop } from "./Shop";
import { Utils } from "../../Utils/utils";
import { CategoryBuilder } from "./CategoryBuilder";
import { CurrencyInfo } from "../../Configuration/Shop/currency";

class ShopBuilder {
    public readonly id: string;

    public readonly data: ShopData;

    public mainPage!: ShopPage;

    public readonly pages: Map<ShopCategory, ShopPage> = new Map();

    public constructor(id: string, name: string) {
        this.id = id;
        this.data = { info: { id, name, currency: "money" }, categories: [], items: [] }
    }

    // Formats and sets default values that aren't specified.
    private _processCategory(category: ShopCategory, defaultCurrency: ShopCurrency): void {
        category.items.sort((a, b) => a.price - b.price)
        const formatIds = category.formatIds
        for (const item of category.items) {
            if (formatIds)
                if (item.id.indexOf(":") === -1) item.id = `minecraft:${item.id}`
            item.currency ??= defaultCurrency;
            item.display ??= { name: Utils.formatString(item.id), price: CurrencyInfo[item.currency].prefix + Utils.formatInt(item.price) + CurrencyInfo[item.currency].suffix };
            item.slider ??= { step: 1, max: 64 };
        }

        for (const subCategory of category.categories) {
            this._processCategory(subCategory, defaultCurrency);
        }
    }

    public setDefaultCurrency(currency: ShopCurrency) {
        this.data.info.currency = currency;
        return this
    }

    public addCategory(categoryBuilder: CategoryBuilder): this {
        const categoryInfo = categoryBuilder.info;
        this._processCategory(categoryInfo, this.data.info.currency);
        this.data.categories.push(categoryInfo);
        return this;
    }

    public addItem(item: ShopItem) {
        const currency = item.currency ?? this.data.info.currency
        if (item.id.indexOf(":") === -1) item.id = `minecraft:${item.id}`
        this.data.items.push({
            ...item,
            display: item.display ?? { name: Utils.formatString(item.id), price: CurrencyInfo[currency].prefix + Utils.formatInt(item.price) + CurrencyInfo[currency].suffix },
            currency: currency,
            slider: item.slider ?? { step: 1, max: 64 },
        });
        return this;
    }


    /**
     * Creates the shop instance to be used from the data provided.
     */
    public initialize() {
        this.mainPage = new ShopFormPage(this);
        try {
            for (const category of this.data.categories ?? []) {
                this.pages.set(category, new ShopFormPage(this, category));
                this.setSubCategoryPages(category);
            }
        } catch (e) {
            Shop.logger.warn(`§c${e}`);
            return;
        }
        Shop.logger.info(`§aInitialized shop '§e${this.id}§a'.`);
    }

    private setSubCategoryPages(category: ShopCategory) {
        if (category.categories) {
            this.pages.set(category, new ShopFormPage(this, category));
            for (const subCategory of category.categories) {
                this.setSubCategoryPages(subCategory);
            }
        }
    }

    public updateCategory(category: CategoryBuilder) {
        const categoryInfo = category.info;
        this._processCategory(categoryInfo, this.data.info.currency);
        const existingIndex = this.data.categories.findIndex(cat => cat.id === categoryInfo.id);
        if (existingIndex !== -1) {
            this.data.categories[existingIndex] = categoryInfo;
        } else {
            this.data.categories.push(categoryInfo);
        }
        this.pages.set(categoryInfo, new ShopFormPage(this, categoryInfo));
        this.setSubCategoryPages(categoryInfo);
        return this;
    }

    public showCategory(
        player: Player,
        id: string
    ) {
        const category = this.data.categories.find(cat => cat.id === id);
        if (!category) {
            throw new Error(`Category with id '${id}' does not exist in shop '${this.id}'.`);
        }
        this.showPage(player, category, []);
    }

    public showPage(
        player: Player,
        category: ShopCategory,
        previousCategories?: ShopCategory[]
    ) {
        if (!this.pages.has(category)) {
            throw new Error(`Page does not exist for shop '${this.id}'.`);
        }
        const page = this.pages.get(category);
        if (page instanceof ShopFormPage) {
            page.show(player, previousCategories ?? []);
        }
    }

    public show(player: Player) {
        this.mainPage.show(player, []);
    }
}

export { ShopBuilder }