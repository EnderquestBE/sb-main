import { Player } from "@serenityjs/core";
import { ShopBuilder } from "../ShopBuilder";
import { ShopCategory } from "../../../Types/types";

class ShopPage {
  protected readonly shop: ShopBuilder

  public constructor(shop: ShopBuilder) {
    this.shop = shop;
  }

  public show(_player: Player, _previousCategories: ShopCategory[]) {
    // Implemented by page.
  }
}

export { ShopPage };
