import { MessageForm, Player } from "@serenityjs/core";
import { ShopItem } from "../../../../../Types/types";
import { Utils } from "../../../../../Utils/utils";
import { CurrencyInfo } from "../../../../../Configuration/Shop/currency";
import { ShopConfirmationPage } from "../confirmation";

class ShopItemConfirmationPage extends ShopConfirmationPage {

  public constructor(item: ShopItem, amount: number) {
    super()
    this.form.content = `Are you sure you want to purchase this item?\n§7» §a${item.display!.name} §8x§7${amount} for ${item.currency! === "money" ? "§6" : "§a"}${CurrencyInfo[item.currency!].prefix + Utils.formatInt((item.price) * amount) + CurrencyInfo[item.currency!].suffix} §8(at §e${item.display!.price} §8each)`
  }

  public show(player: Player) {
    return this.form.show(player);
  }
}

export { ShopItemConfirmationPage };
