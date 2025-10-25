import { Block, Container } from "@serenityjs/core";

type KitData = {
    /* Identifier for the kit. */
    id: string;
    /* Name of the kit. */
    name: string;
    /* Display name shown on the kit item. */
    displayName: string;
    /* Cooldown time after redeeming in hours. */
    cooldown: number;
    /* Function to execute on the chest when placed to populate its contents. */
    onPlace: (block: Block, container: Container) => void;
};

class Kit {
    public static kits: Map<string, KitData> = new Map();

    public static get keys(): string[] {
        return Array.from(Kit.kits.keys());
    }

    public static get(id: string): KitData | null {
        return Kit.kits.get(id) || null;
    }

    public static getAll(): KitData[] {
        return Array.from(Kit.kits.values());
    }

    constructor(data: KitData) {
        Kit.kits.set(data.id, data);
    }
}

export { Kit, KitData }