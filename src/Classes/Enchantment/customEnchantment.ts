import { EnchantmentSlotType } from "../../Configuration/config";
import { EnchantmentHandler } from "../../Handlers/Enchantment/handler";
import { BlockBreakEnchantmentEvent, CustomEnchantmentProperties, EnchantmentActivationChance, EnchantmentRarity, EntityHurtEnchantmentEvent, WhileEquippedEnchantmentEvent } from "../../Types/types";

enum EnchantmentRarityColor {
    Common = "§7",
    Rare = "§a",
    Legendary = "§6",
    Exotic = "§d"
}

class CustomEnchantment {
    private properties: CustomEnchantmentProperties;
    entityHurt?: (event: EntityHurtEnchantmentEvent) => void;
    blockBreak?: (event: BlockBreakEnchantmentEvent) => void;
    whileEquipped?: (event: WhileEquippedEnchantmentEvent) => void;

    constructor(id: string, name: string) {
        this.properties = {
            id: id,
            name: name,
            description: "",
            rarity: EnchantmentRarity.Common,
            slots: [],
            activationChance: { base: 0, perLevel: 0, minimum: 0 },
            incompatible: [],
        };
    }

    public get id(): string { return this.properties.id; }
    public set id(value: string) { this.properties.id = value; }

    public get name(): string { return this.properties.name; }
    public set name(value: string) { this.properties.name = value; }

    public get description(): string { return this.properties.description; }
    public set description(value: string) { this.properties.description = value; }

    public get rarity(): EnchantmentRarity { return this.properties.rarity; }
    public set rarity(value: EnchantmentRarity) { this.properties.rarity = value; }

    public get color(): string { return EnchantmentRarityColor[EnchantmentRarity[this.rarity] as keyof typeof EnchantmentRarityColor]; }

    public get slots(): EnchantmentSlotType[] { return this.properties.slots; }
    public set slots(value: EnchantmentSlotType[]) { this.properties.slots = value; }

    public get activationChance(): EnchantmentActivationChance { return this.properties.activationChance; }
    public set activationChance(value: EnchantmentActivationChance) { this.properties.activationChance = value; }

    public get incompatible(): string[] { return this.properties.incompatible; }
    public set incompatible(value: string[]) { this.properties.incompatible = value; }

    // Builder Methods
    public setDescription(description: string): this {
        this.properties.description = description;
        return this;
    }

    public setRarity(rarity: keyof typeof EnchantmentRarity): this {
        this.properties.rarity = EnchantmentRarity[rarity];
        return this;
    }

    public allowOnSlots(...slots: (keyof typeof EnchantmentSlotType)[]): this {
        this.properties.slots = slots.map((x) => EnchantmentSlotType[x]);
        return this;
    }

    public setActivationChance(chance: EnchantmentActivationChance): this {
        this.properties.activationChance = chance;
        return this;
    }

    public setIncompatible(...ids: string[]): this {
        this.properties.incompatible = ids;
        return this;
    }

    // Event Hooks
    public onEntityHurt(callback: (event: EntityHurtEnchantmentEvent) => void): this {
        this.entityHurt = callback;
        return this;
    }

    public onBlockBreak(callback: (event: BlockBreakEnchantmentEvent) => void): this {
        this.blockBreak = callback;
        return this;
    }

    public whileItemEquipped(callback: (event: WhileEquippedEnchantmentEvent) => void): this {
        this.whileEquipped = callback;
        return this;
    }

    public register() {
        EnchantmentHandler.register(this);
    }
}

export { CustomEnchantment, EnchantmentRarityColor };

