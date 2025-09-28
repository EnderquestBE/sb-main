import { ItemStack } from "@serenityjs/core";
import { CompoundTag, ShortTag } from "@serenityjs/nbt";
import { CustomEnchantment } from "../Classes/Enchantment/customEnchantment";
import { EnchantmentHandler } from "../Handlers/Enchantment/handler";
import { Utils } from "../Utils/utils";
import { CEConfig } from "../Configuration/config";

class CustomEnchantmentData {
  public id: string;
  public level: number;
  constructor(id: string, level: number) {
    this.id = id;
    this.level = level;
  }

  public get info(): CustomEnchantment {
    return EnchantmentHandler.getById(this.id)!;
  }

  public toNBT(): ShortTag {
    return new ShortTag(this.level, this.id);
  }
}

declare module "@serenityjs/core" {
  interface ItemStack {
    addCustomEnchantment(enchantmentId: string, level: number): { success: boolean; error?: any };
    getCustomEnchantments(): CustomEnchantmentData[] | undefined;
    getCustomEnchantmentLevel(enchantmentId: string): number | undefined;
    setCustomEnchantmentLevel(enchantmentId: string, level: number): void;
    increaseCELevel(enchantmentId: string, amount: number): { success: boolean; error?: any };
    decreaseCELevel(enchantmentId: string, amount: number): void;
    hasCustomEnchantment(enchantmentId: string): boolean;
    removeCustomEnchantment(enchantmentId: string): void;
    isCustomEnchanted(): boolean;

    miningSpeed: number;
  }
}

function updateCELore(item: ItemStack) {
  const enchantments = item.getCustomEnchantments();
  if (!enchantments) return
  const lore = enchantments.map((enchantment) => {
    return `§r${enchantment.info.color}${enchantment.info.name} ${Utils.toRomanNumeral(enchantment.level)}`;
  });
  item.setLore(lore);
}

ItemStack.prototype.addCustomEnchantment = function (enchantmentId: string, level: number): { success: boolean; error?: any } {
  try {
    // Get CEs. If the item does not have any, create a new list.
    const enchantments = this.nbt.get<CompoundTag>("CustomEnchantments") ?? new CompoundTag("CustomEnchantments")

    // Get enchantment info.
    const info = EnchantmentHandler.getById(enchantmentId);
    if (!info) throw new Error("Invalid enchantment ID.");

    // Check if the item has reached the enchantment cap.
    if (enchantments.size >= CEConfig.MAX_SLOTS) throw new Error(`This item has reached the enchantment limit of §e${CEConfig.MAX_SLOTS}§c.`);

    // Add the enchantment.
    enchantments.set(enchantmentId, new ShortTag(level, enchantmentId))

    // Update nbt.
    this.nbt.set("CustomEnchantments", enchantments)

    // Update lore.
    updateCELore(this);
    return { success: true };
  } catch (e) {
    return { success: false, error: e };
  }
};

ItemStack.prototype.getCustomEnchantments = function (): CustomEnchantmentData[] | undefined {
  // Return a map of CustomEnchantmentData if the item has any CEs.
  const enchantments = this.nbt.get<CompoundTag>("CustomEnchantments");
  return enchantments ? Array.from(enchantments.entries()).map(([id, tag]) => new CustomEnchantmentData(id, (tag as ShortTag).valueOf())) : undefined;
};

ItemStack.prototype.getCustomEnchantmentLevel = function (enchantmentId: string): number | undefined {
  // Get the enchantments.
  const enchantments = this.nbt.get<CompoundTag>("CustomEnchantments");
  if (!enchantments) return undefined;

  // Find the enchantment.
  const enchantment = enchantments.get<ShortTag>(enchantmentId);
  return enchantment ? enchantment.valueOf() : undefined;
};

ItemStack.prototype.setCustomEnchantmentLevel = function (enchantmentId: string, level: number): void {
  // Get the enchantments.
  const enchantments = this.nbt.get<CompoundTag>("CustomEnchantments");
  if (!enchantments) return;

  // Create new list of filtered enchantments.
  const filtered = new CompoundTag("CustomEnchantments")
  for (const [id, tag] of enchantments) {
    if (id !== enchantmentId) filtered.set(id, tag);
  }

  // Add the new enchantment.
  filtered.set(enchantmentId, new ShortTag(level, enchantmentId))

  // Update nbt.
  this.nbt.set("CustomEnchantments", filtered)

  // Update lore.
  updateCELore(this);
};

ItemStack.prototype.increaseCELevel = function (enchantmentId: string, amount: number): { success: boolean; error?: any } {
  try {
    // Get the enchantments.
    const enchantments = this.nbt.get<CompoundTag>("CustomEnchantments");
    if (!enchantments) return { success: false, error: new Error("You do not have that enchantment.") };

    // Get enchantment info.
    const info = EnchantmentHandler.getById(enchantmentId);
    if (!info) return { success: false, error: new Error("Invalid enchantment.") };

    // Create new list of filtered enchantments.
    let level = amount;
    const filtered = new CompoundTag("CustomEnchantments")
    for (const [id, tag] of enchantments) {
      if (id !== enchantmentId) filtered.set(id, tag);
      else level += (tag as ShortTag).valueOf();
    }

    // Check if the enchantment has reached the maximum level.
    if (info && level > CEConfig.MAX_LEVEL) throw new Error(`This enchantment is already at the maximum level of ${CEConfig.MAX_LEVEL}.`);

    // Add the new enchantment.
    filtered.set(enchantmentId, new ShortTag(level, enchantmentId))

    // Update nbt.
    this.nbt.set("CustomEnchantments", filtered)

    // Update lore.
    updateCELore(this);
    return { success: true };
  } catch (e) {
    return { success: false, error: e };
  }
};

ItemStack.prototype.decreaseCELevel = function (enchantmentId: string, amount: number): void {
  // Get the enchantments.
  const enchantments = this.nbt.get<CompoundTag>("CustomEnchantments");
  if (!enchantments) return;

  // Create new list of filtered enchantments.
  let level = -amount;
  const filtered = new CompoundTag("CustomEnchantments")
  for (const [id, tag] of enchantments) {
    if (id !== enchantmentId) filtered.set(id, tag);
    else level += (tag as ShortTag).valueOf();
  }

  // Add the new enchantment.
  filtered.set(enchantmentId, new ShortTag(Math.max(1, level), enchantmentId))

  // Update nbt.
  this.nbt.set("CustomEnchantments", filtered)

  // Update lore.
  updateCELore(this);
};

ItemStack.prototype.hasCustomEnchantment = function (enchantmentId: string): boolean {
  // Check if the item has a CE.
  const enchantments = this.nbt.get<CompoundTag>("CustomEnchantments");
  return enchantments ? enchantments.has(enchantmentId) : false;
};

ItemStack.prototype.removeCustomEnchantment = function (enchantmentId: string): void {
  // Get the enchantments.
  const enchantments = this.nbt.get<CompoundTag>("CustomEnchantments");
  if (!enchantments) return;

  // Create new list of filtered enchantments.
  const filtered = new CompoundTag("CustomEnchantments");
  for (const [id, tag] of enchantments) {
    if (id !== enchantmentId) filtered.set(id, tag);
  }
  // If there are no enchantments, remove the nbt so the item is no longer considered enchanted.
  if (filtered.size === 0) {
    this.nbt.delete("CustomEnchantments");
    this.setLore([]);
    return;
  }
  // Set enchantment data.
  else {
    // Update nbt.
    this.nbt.set("CustomEnchantments", filtered);
    // Update lore.
    updateCELore(this);
  }
};

ItemStack.prototype.isCustomEnchanted = function (): boolean {
  return this.nbt.get<CompoundTag>("CustomEnchantments") ? true : false;
};