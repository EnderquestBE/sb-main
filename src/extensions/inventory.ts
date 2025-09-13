import {
  EntityInventoryTrait,
  ItemStack,
  Player,
} from "@serenityjs/core";

class PlayerInventory {
  private readonly player: Player;

  constructor(player: Player) {
    this.player = player;
  }

  public readonly getItemCount = (itemId: string) => {
    const { container } = this.player.getTrait(EntityInventoryTrait);
    return container.storage.reduce((sum, item) => {
      return sum + (item?.identifier === itemId ? item?.stackSize : 0);
    }, 0);
  };

  public readonly addItem = (item: ItemStack, amount: number) => {
    const { container } = this.player.getTrait(EntityInventoryTrait);
    let giveCount = amount;
    while (giveCount > 0) {
      if (giveCount > 64) {
        item.stackSize = 64;
        container.addItem(item);
        giveCount -= 64;
      } else {
        item.stackSize = giveCount;
        container.addItem(item);
        break;
      }
    }
  };

  public readonly clearItem = (itemId: string, amount: number) => {
    const { container } = this.player.getTrait(EntityInventoryTrait);
    let clearAmount = amount;
    let clearCount = 0;

    for (const [slot, itemStack] of Object.entries(container.storage)) {
      if (!itemStack || itemStack.type.identifier !== itemId) {
        continue;
      }

      const stackAmount = itemStack.stackSize;
      const amountLeftToClear = (clearAmount ?? 1) - clearCount;

      if (stackAmount <= amountLeftToClear) {
        container.clearSlot(Number.parseInt(slot));
        clearCount += stackAmount;
      } else {
        itemStack.setStackSize(stackAmount - amountLeftToClear);
        clearCount += amountLeftToClear;
      }
      if (clearCount >= (clearAmount ?? 1)) break;
    }
  };
}

export { PlayerInventory };
