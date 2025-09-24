import { ActionFormImage, ItemStack } from "@serenityjs/core";
import { ShopTransactionPage } from "../../Classes/Shop/Pages/Form/transaction";

/**
 * Shop information type.
 */
interface ShopInfo {
  id: string; // Shop identifier.
  name: string; // Shop display name.
  currency: ShopCurrency; // Default currency to use for buying/selling items.
}

/**
 * Shop currency type.
 */
type ShopCurrency = "money" | "xp"

/**
 * Form display information for an entry.
 */
interface ShopDisplay {
  name: string; // Overrides the item's name when displayed.
  description?: string; // Displays under item name.
  icon?: ActionFormImage; // Overrides the item's icon when displayed.
}

/**
 * Defines a new price or multiplier for an item if before a certain date.
 */
interface ShopItemSale {
  type: "fixed" | "multiplier"; // Fixed will set a new price during the sale, multiplier will multiply the existing price.
  price: number; // Price value.
  expires?: string; // Date for the sale to expire on.
}

interface SliderOptions {
  step: number; // The increment of the amount slider, defaults to 1.
  max: number; // The maximum amount of the amount slider, defaults to 64.
}

/**
 * Shop category type.
 */
interface ShopCategory {
  id: string; // Category identifier.
  items: ShopItem[]; // Items in this category.
  categories: ShopCategory[]; // Category subcategories.
  display: ShopDisplay; // Category display overrides.
  formatIds?: boolean; // Whether or not to format item ids when registered.
}

/**
 * Shop item type.
 */
interface ShopItem {
  id: string; // ID of item to be given to the player.
  price: number; // Purchase price of this item entry.
  display?: ShopDisplay & { price: string }; // Item display overrides.
  transactionType?: new (...args: any[]) => ShopTransactionPage // Class to use for transaction page construction.
  transactionSound?: string; // Sound to play when the transaction is completed.
  slider?: SliderOptions; // Amount slider options.
  currency?: ShopCurrency; // Overrides the default currency for this item entry.
  item?: ItemStack; // Item to be given to the player when purchased.
  sales?: ShopItemSale[]; // Dynamically adjusts the item price before a given date.
}

/**
 * Shop data type.
 */
interface ShopData {
  info: ShopInfo; // Shop information.
  categories: ShopCategory[]; // Shop categories.
  items: ShopItem[]; // Shop items.
}

export type { ShopData, ShopInfo, ShopCurrency, ShopDisplay, ShopCategory, ShopItem, ShopItemSale };