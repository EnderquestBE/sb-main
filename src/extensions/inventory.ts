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

  public readonly giveItem = (item: string, amount: number) => {
    const { container } = this.player.getTrait(EntityInventoryTrait);
    const itemStack = new ItemStack(item)
    let giveCount = amount;
    while (giveCount > 0) {
      if (giveCount > 64) {
        itemStack.stackSize = 64;
        container.addItem(itemStack);
        giveCount -= 64;
      } else {
        itemStack.stackSize = giveCount;
        container.addItem(itemStack);
        break;
      }
    }
  };

  public readonly giveItems = (...items: [item: string, amount: number][]) => {
    const { container } = this.player.getTrait(EntityInventoryTrait);
    for (const [item, amount] of items as [string, number][]) {
      const itemStack = new ItemStack(item)
      let giveCount = amount;
      while (giveCount > 0) {
        if (giveCount > 64) {
          itemStack.stackSize = 64;
          container.addItem(itemStack);
          giveCount -= 64;
        } else {
          itemStack.stackSize = giveCount;
          container.addItem(itemStack);
          break;
        }
      }
    }
  };

  public readonly addItem = (item: ItemStack) => {
    const { container } = this.player.getTrait(EntityInventoryTrait);
    container.addItem(item)
  }

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

  public readonly consume = (itemId: string, amount: number, requiresNbt: { [key: string]: any }): boolean => {
    const { container } = this.player.getTrait(EntityInventoryTrait);
    let consumeAmount = amount;
    let consumeCount = 0;

    for (const [slot, itemStack] of Object.entries(container.storage)) {
      if (!itemStack || itemStack.type.identifier !== itemId) {
        continue;
      }

      if (requiresNbt) {
        let matches = true;
        for (const [key, value] of Object.entries(requiresNbt)) {
          if (itemStack.nbt.get(key)?.valueOf() !== value) {
            matches = false;
            break;
          }
        }
        if (!matches) continue;
      }

      const stackAmount = itemStack.stackSize;
      const amountLeftToConsume = (consumeAmount ?? 1) - consumeCount;

      if (stackAmount <= amountLeftToConsume) {
        container.clearSlot(Number.parseInt(slot));
        consumeCount += stackAmount;
      } else {
        itemStack.setStackSize(stackAmount - amountLeftToConsume);
        consumeCount += amountLeftToConsume;
      }
      if (consumeCount >= (consumeAmount ?? 1)) break;
    }
    return consumeCount >= (consumeAmount ?? 1);
  };
}

export { PlayerInventory };
