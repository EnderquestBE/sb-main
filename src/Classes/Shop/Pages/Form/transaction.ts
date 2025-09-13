import {
  ModalForm,
  Player,
} from "@serenityjs/core";
import { ShopPage } from "../page";
import { ShopConfirmationPage } from "./confirmation";
import { ShopCurrency, ShopItem } from "../../../../Types/types";
import { ShopBuilder } from "../../ShopBuilder";
import { Utils } from "../../../../Utils/utils";

class ShopTransactionPage extends ShopPage {
  public readonly form: ModalForm;
  public readonly item: ShopItem;
  public confirmPage!: new (...args: any[]) => ShopConfirmationPage;

  public constructor(shop: ShopBuilder, item: ShopItem) {
    super(shop);
    this.item = item;
    const data = this.shop.data;
    const info = data.info;
    this.form = new ModalForm(info.name);
  }

  public show(player: Player) {
    this.form.show(player, (result) => {
      if (result === null) {
        player.info(`§cTransaction canceled successfully.`);
        return;
      }
      let amount = result[2] as number;
      if (!(amount > 0)) amount = result[1] as number;
      if (!(amount > 0)) this.show(player);

      // Sale functionality
      let cprice = amount * this.item.price;
      if (this.item.sales)
        for (let sale of this.item.sales) {
          if (sale.expires && new Date(sale.expires) < new Date()) continue;
          if (sale.type === "fixed") {
            cprice = sale.price;
            break;
          } else if (sale.type === "multiplier") {
            cprice *= sale.price;
          }
        }

      new this.confirmPage(this.item, amount)
        .show(player)
        .then((result) => {
          if (result === true) {
            this.checkout(player, amount, cprice)
          } else {
            player.info(`§cTransaction canceled successfully.`);
            return;
          }
        });
    });
  }

  public checkout(_player: Player, _amount: number, _totalPrice: number) {
  }

  public checkCurrency(player: Player, totalPrice: number, currency: ShopCurrency) {
    if (currency === "money") {
      const money = player.getMoney()
      if (money < totalPrice) {
        player.error(`You are missing §e$${Utils.formatInt(totalPrice - money)} §cto afford this.`, "shop");
        return false
      }
    } else if (currency === "xp") {
      const xp = player.getTotalXp()
      if (xp < totalPrice) {
        player.error(`You are missing §e${Utils.formatInt(totalPrice - xp)} §aXP §cto afford this.`, "shop");
        return false
      }
    }
    return true
  }

  public takeCurrency(player: Player, totalPrice: number, currency: ShopCurrency) {
    if (currency === "money") return player.removeMoney(totalPrice)
    if (currency === "xp") return player.removeXp(totalPrice)
  }
}

export { ShopTransactionPage };
