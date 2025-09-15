import { Document } from "mongodb";

interface VendorItem {
    identifier: string;
    amount: number;
}

interface VendorData extends Document {
    xuid: string;
    stock: VendorItem[];
}

export { VendorData, VendorItem };