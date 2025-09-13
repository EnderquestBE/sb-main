import { ShopCategory, ShopItem } from "../../Types/types";

class CategoryBuilder {
    public readonly info: ShopCategory;

    public constructor(category: Omit<ShopCategory, "items" | "categories">) {
        this.info = {
            ...category,
            display: {
                ...category.display,
                description: category.display.description ?? "",
            },
            items: [],
            categories: [],
        };
    }

    public addItem(item: ShopItem): this {
        this.info.items.push(item);
        return this;
    }

    public addSubCategory(categoryBuilder: CategoryBuilder): this {
        this.info.categories.push(categoryBuilder.info);
        return this;
    }
}

export { CategoryBuilder };