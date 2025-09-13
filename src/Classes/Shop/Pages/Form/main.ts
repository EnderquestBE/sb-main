import { ActionForm, ActionFormImage, Player } from "@serenityjs/core";
import { ShopPage } from "../page";
import { DataFormButton, ShopCategory, ShopItem } from "../../../../Types/types";
import { ShopBuilder } from "../../ShopBuilder";
import { ShopItemTransactionPage } from "./Item/itemTransaction";
import { Utils } from "../../../../Utils/utils";

class ShopFormPage extends ShopPage {
  private form: ActionForm;
  private category?: ShopCategory;
  private categories: [ShopCategory, DataFormButton][] = [];
  private items: [ShopItem, DataFormButton][] = [];

  public constructor(shop: ShopBuilder, category?: ShopCategory) {
    super(shop);
    this.category = category;
    const info = this.shop.data.info,
      categories = category ? category.categories : this.shop.data.categories,
      items = category ? category.items : this.shop.data.items;
    this.form = new ActionForm(info.name);
    if (categories) {
      for (let category of categories) {
        this.categories.push([
          category,
          [
            `${category.display.name}\n${category.display.description}`,
            category.display.icon as ActionFormImage | undefined,
          ],
        ]);
      }
    }
    for (let item of items) {
      this.items.push([
        item,
        [
          `${item.display!.name} (${item.display!.price})`,
          item.display!.icon as ActionFormImage | undefined,
        ],
      ]);
    }
    for (let category of this.categories) this.form.button(...category[1]);
    for (let item of this.items) this.form.button(...item[1]);
  }

  public show(player: Player, previousCategories: ShopCategory[]) {
    // Show form.
    if (!this.category) {
      const currency = this.shop.data.info.currency
      if (currency === "money") this.form.content = `§eYour Balance: §6$${Utils.formatInt(player.getMoney())}`
      else if (currency === "xp") this.form.content = `§eYour XP: §a${Utils.formatInt(player.getXp())}`
    }
    this.form.show(player, (result) => {
      if (result === null) {
        const lastCategory = previousCategories?.pop();
        if (lastCategory) {
          this.shop.showPage(player, lastCategory, previousCategories);
        } else if (this.category) {
          this.shop.show(player);
        }
        return;
      }
      if (result < this.categories.length) {
        const category = this.categories[result]?.[0];
        if (category) {
          if (this.category) previousCategories?.push(this.category);
          this.shop.showPage(player, category, previousCategories);
        }
      } else {
        result -= this.categories.length;
        const item = this.items[result]?.[0];
        if (item) {
          if (this.category) previousCategories?.push(this.category);
          new (item.transactionType ?? ShopItemTransactionPage)(this.shop, item).show(player);
        }
      }
    });
  }
}

export { ShopFormPage };
