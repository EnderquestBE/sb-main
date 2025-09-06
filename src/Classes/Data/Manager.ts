import { Document, UpdateFilter } from "mongodb";
import { CollectionManager } from "../classes";
import { OperationResult } from "../../Types/types";

/**
 * Generic class to handle data management for data-based classes.
 */
export abstract class DataManager<TData extends Document, TDatabase extends CollectionManager<TData>> {
  protected data: TData;
  protected db: TDatabase;

  protected constructor(initialData: TData, dbManager: TDatabase) {
    this.data = initialData;
    this.db = dbManager;
  }

  /**
   * Updates a single value to the document.
   */
  protected async updateOne(updateDoc: UpdateFilter<TData>): Promise<OperationResult> {
    try {
      const identifier = (this.data as any)[this.db['key']];
      const result = await this.db.updateOne(identifier, updateDoc);
      const success = result.modifiedCount > 0;

      if (success) {
        // Manually update local version to keep sync without having to load again.
        if (updateDoc.$inc) {
          for (const key in updateDoc.$inc) {
            const keys = key.split('.');
            let current: any = this.data;
            for (let i = 0; i < keys.length - 1; i++) {
              const currentKey = keys[i]!;
              if (current[currentKey] === undefined) current[currentKey] = {};
              current = current[currentKey];
            }
            current[keys[keys.length - 1]!] = (current[keys[keys.length - 1]!] || 0) + updateDoc.$inc[key];
          }
        }
        if (updateDoc.$set) {
          for (const key in updateDoc.$set) {
            const keys = key.split('.');
            let current: any = this.data;
            for (let i = 0; i < keys.length - 1; i++) {
              const currentKey = keys[i]!;
              if (current[currentKey] === undefined) current[currentKey] = {};
              current = current[currentKey];
            }
            current[keys[keys.length - 1]!] = updateDoc.$set[key];
          }
        }
        if (updateDoc.$unset) {
          for (const key in updateDoc.$unset) {
            const keys = key.split('.');
            let current: any = this.data;
            for (let i = 0; i < keys.length - 1; i++) {
              const currentKey = keys[i]!;
              if (current[currentKey] === undefined) break;
              current = current[currentKey];
            }
            delete current[keys[keys.length - 1]!];
          }
        }
      }
      return { success };
    } catch (e: any) {
      console.error(`[Database Error] Failed to update document:`, e);
      return { success: false, reason: "A database error occurred." };
    }
  }

  protected async _addToArray<T>(key: keyof TData, value: T): Promise<OperationResult> {
    const updateDoc = { $push: { [key]: value } } as UpdateFilter<TData>;
    const result = await this.updateOne(updateDoc);
    if (result.success) {
      (this.data[key] as T[]).push(value);
    }
    return result;
  }

  protected async _removeFromArrayByField(key: keyof TData, field: string, value: any): Promise<OperationResult> {
    const updateDoc = { $pull: { [key]: { [field]: value } } } as UpdateFilter<TData>;
    const result = await this.updateOne(updateDoc);
    if (result.success) {
      (this.data[key] as any[]) = (this.data[key] as any[]).filter(item => item[field] !== value);
    }
    return result;
  }

  protected async _removeFromArrayByValue(key: keyof TData, value: any): Promise<OperationResult> {
    const updateDoc = { $pull: { [key]: value } } as UpdateFilter<TData>;
    const result = await this.updateOne(updateDoc);
    if (result.success) {
      (this.data[key] as any[]) = (this.data[key] as any[]).filter(item => item !== value);
    }
    return result;
  }
}
