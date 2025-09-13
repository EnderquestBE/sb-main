import { WeightedItem } from "../Types/types";

/**
 * Performs selections of a list of weighted items.
 * @template T Item type.
 */
export class WeightedSelector<T> {
  private cumulativeWeights: number[] = [];
  private items: WeightedItem<T>[] = [];
  public totalWeight: number = 0;

  constructor(items: WeightedItem<T>[]) {
    if (items.length === 0) {
      throw new Error("Selector does not contain any items.");
    }

    this.items = items;
    let cumulativeWeight = 0;

    for (const item of items) {
      if (item.weight < 0) continue;
      cumulativeWeight += item.weight;
      this.cumulativeWeights.push(cumulativeWeight);
    }
    this.totalWeight = cumulativeWeight;
  }

  /**
   * Select a random item using weights.
   * @returns Selected item.
   */
  public select(): T | null {
    if (this.totalWeight === 0) {
      return null;
    }
    const randomWeight = Math.random() * this.totalWeight;
    // Uses binary search to find matching item.
    let low = 0;
    let high = this.cumulativeWeights.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (this.cumulativeWeights[mid]! < randomWeight) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return this.items[low]?.value ?? null;
  }
}
