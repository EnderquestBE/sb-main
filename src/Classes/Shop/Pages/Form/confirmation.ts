import { MessageForm, Player } from "@serenityjs/core";

class ShopConfirmationPage {
  public readonly form: MessageForm;

  public constructor() {
    this.form = new MessageForm("Confirm Purchase");
    this.form.button1 = "Confirm";
    this.form.button2 = "Cancel";
  }

  public show(player: Player) {
    return this.form.show(player);
  }
}

export { ShopConfirmationPage };
