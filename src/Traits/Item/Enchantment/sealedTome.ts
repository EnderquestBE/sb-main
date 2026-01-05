import { ItemStackTrait, MessageForm, Player } from "@serenityjs/core";
import { CompoundTag, StringTag } from "@serenityjs/nbt";
import { ItemUseMethod } from "@serenityjs/protocol";
import { EnchantmentRarity } from "../../../Types/types";
import { SealedTomeConfig } from "../../../Configuration/config";
import { Utils } from "../../../Utils/utils";
import { EnchantmentHandler } from "../../../Handlers";
import { EnchantmentTome } from "../../../Classes";

class SealedTomeTrait extends ItemStackTrait {
  public static readonly identifier = "sealed_tome";

  public static readonly types = ["minecraft:book"];

  public onUseOnBlock(player: Player): boolean | ItemUseMethod | void {
    if (player.pendingForms.size > 0) return false;
    // Get sealed tome data (rarity).
    const tag = this.item.nbt.get<CompoundTag>("SealedTome");
    if (!tag) return false;
    const rarityTag = tag.get<StringTag>("Rarity");
    if (!rarityTag) return false;
    const rarity = rarityTag.valueOf() as keyof typeof EnchantmentRarity;
    if (!rarity) return false;

    // Prompt tome open.
    const price = SealedTomeConfig.OPEN_COST(rarity);
    const form = new MessageForm("Sealed Tome");
    form.content = `${this.item.getDisplayName()}\n§fYou can feel the power of a §l${rarityTag.valueOf()}§r§f enchantment radiating from the pages within.\n\n§bReveal Price: §e$${Utils.formatInt(
      price
    )}`;
    form.button1 = "Reveal";
    form.button2 = "Cancel";
    form.show(player, (result, error) => {
      if (error || !result) return;
      this._openTome(player, price, rarity);
    });
    return true;
  }

  private _openTome(
    player: Player,
    price: number,
    rarity: keyof typeof EnchantmentRarity
  ) {
    // Check if they can afford it.
    if (price > player.getMoney()) {
      player.error("You cannot afford this.");
      return;
    }
    // Check if inventory is full.
    if (!this.item.container) return;
    if (this.item.container.emptySlotsCount < 1) {
      player.error("Your inventory is full. Clear some space and try again.");
      return;
    }
    // Construct enchantment tome item.
    const enchants = EnchantmentHandler.getAllOfRarity(
      EnchantmentRarity[rarity]
    );
    if (enchants.length === 0) {
      player.error(
        "There are currently no obtainable enchantments of this rarity."
      );
      return;
    }
    const selected = enchants[Utils.randomInt(0, enchants.length - 1)];
    if (!selected) {
      player.error("Failed to reveal enchantment. Please try again.");
      return;
    }
    const enchantTome = new EnchantmentTome(selected.id);
    // Remove money.
    player.removeMoney(price);
    // Remove sealed tome.
    this.item.decrementStack();
    // Give enchantment tome.
    this.item.container.addItem(enchantTome);
    // Show success form.
    const form2 = new MessageForm("Tome Reveal");
    form2.content = `§dThe enchantment within has been revealed!\n\n§6You found a ${enchantTome.getDisplayName()} §r§6CE with §c${Utils.formatInt(
      enchantTome.strength!
    )}%%%% §6strength!`;
    form2.button1 = "Next";
    form2.button2 = "Cancel";
    form2.show(player, (result, error) => {
      if (error || !result) return;
      if (this.item.getStackSize() > 0) {
        this._openTome(player, price, rarity);
      }
    });
  }
}

export { SealedTomeTrait };
