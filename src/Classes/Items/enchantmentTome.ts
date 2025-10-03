import { ItemIdentifier, ItemStack } from "@serenityjs/core";
import { CompoundTag, ShortTag, StringTag } from "@serenityjs/nbt";
import { Utils } from "../../Utils/utils";
import { EnchantmentHandler } from "../../Handlers";
import { SealedTomeConfig } from "../../Configuration/config";

enum EnchantmentSlotDisplay {
    Sword = "§aSword",
    Pickaxe = "§dPickaxe",
    Axe = "§cAxe",
    Shovel = "§eShovel",
    Hoe = "§9Hoe",
    Tool = "§bTool",
    Helmet = "§6Helmet",
    Chestplate = "§cChestplate",
    Leggings = "§aLeggings",
    Boots = "§eBoots",
    Armor = "§6Armor",
}

class EnchantmentTome extends ItemStack {
    constructor(enchantmentId: string) {
        super(ItemIdentifier.EnchantedBook);
        // Get enchantment info.
        const info = EnchantmentHandler.getById(enchantmentId);
        if (!info) throw new Error("Invalid enchantment ID.");
        this.maxStackSize = 1;
        const strength = Utils.randomInt(SealedTomeConfig.MIN_STRENGTH, SealedTomeConfig.MAX_STRENGTH);
        // Set NBT.
        const tag = new CompoundTag()
        tag.set("Enchantment", new StringTag(enchantmentId, "Enchantment"))
        tag.set("Strength", new ShortTag(strength, "Strength"))
        this.nbt.set("EnchantmentTome", tag)

        // Set display.
        this.setDisplayName(`§r§l${info.color}${info.name}§r`);
        this.setLore([
            `§r${EnchantmentSlotDisplay[info.slots[0] as keyof typeof EnchantmentSlotDisplay]} Enchantment`,
            `§r§c${Utils.formatInt(strength)}% §fStrength`,
            `§r§dUse /merge to add this to an item.`
        ])
    }

    public get enchantmentId(): string | undefined {
        const tag = this.nbt.get<CompoundTag>("EnchantmentTome");
        if (!tag) return undefined;
        const enchantmentTag = tag.get<StringTag>("Enchantment");
        if (!enchantmentTag) return undefined;
        return enchantmentTag.valueOf();
    }

    public get strength(): number | undefined {
        const tag = this.nbt.get<CompoundTag>("EnchantmentTome");
        if (!tag) return undefined;
        const strengthTag = tag.get<ShortTag>("Strength");
        if (!strengthTag) return undefined;
        return strengthTag.valueOf();
    }

    public set strength(value: number | undefined) {
        const tag = this.nbt.get<CompoundTag>("EnchantmentTome");
        if (!tag) return;
        if (value === undefined) return;
        tag.set("Strength", new ShortTag(value, "Strength"));
        this.nbt.set("EnchantmentTome", tag);
        const lore = this.getLore();
        if (!lore) return;
        lore[1] = `§r§c${Utils.formatInt(value)}% §fStrength`;
        this.setLore(lore);
    }

    public static is(item: ItemStack): item is EnchantmentTome {
        if (!item) return false;
        if (item.identifier !== ItemIdentifier.EnchantedBook) return false;
        if (!item.nbt.has("EnchantmentTome")) return false;
        Object.setPrototypeOf(item, EnchantmentTome.prototype);
        return true;
    }
}

export { EnchantmentTome }