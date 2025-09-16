import { OperationResult, VendorData, VendorItem } from "../../Types/types";
import { DataManager } from "./Manager";
import { VendorDatabase } from "../Database/Collections/Vendor";
import { ItemStack } from "@serenityjs/core";

class Vendor extends DataManager<VendorData, VendorDatabase> {
    public constructor(initialData: VendorData, dbManager: VendorDatabase) {
        super(initialData, dbManager);
    }

    public static async load(xuid: string): Promise<Vendor | null> {
        const vendorData = await VendorDatabase.instance.get(xuid);
        if (!vendorData) return null;
        return new Vendor(vendorData, VendorDatabase.instance);
    }

    public static async createDefault(xuid: string): Promise<Vendor> {
        const initialData: VendorData = {
            xuid: xuid,
            stock: [{
                identifier: "minecraft:iron_ingot",
                amount: 1
            }]
        };
        await VendorDatabase.instance.create(initialData);
        return new Vendor(initialData, VendorDatabase.instance);
    }

    public getStock(): VendorItem[] {
        return this.data.stock;
    }

    public getItemStock(identifier: string): VendorItem | undefined {
        return this.data.stock.find(item => item.identifier === identifier);
    }

    public hasItemStock(identifier: string, amount: number): boolean {
        const item = this.getItemStock(identifier);
        return item ? item.amount >= amount : false;
    }

    public async addStock(item: string, amount: number): Promise<OperationResult> {
        const stockItem = this.getItemStock(item);
        if (stockItem) {
            stockItem.amount += amount;
        } else {
            this.data.stock.push({ identifier: item, amount });
        }
        return this.updateOne({ $set: { stock: this.data.stock } });
    }

    public async removeStock(identifier: string, amount: number): Promise<OperationResult> {
        const stockItem = this.getItemStock(identifier);
        if (!stockItem || stockItem.amount < amount) {
            return { success: false, reason: "Insufficient stock." };
        }
        stockItem.amount -= amount;
        if (stockItem.amount === 0) {
            this.data.stock = this.data.stock.filter(item => item.identifier !== identifier);
        }
        return this.updateOne({ $set: { stock: this.data.stock } });
    }
}

export { Vendor };