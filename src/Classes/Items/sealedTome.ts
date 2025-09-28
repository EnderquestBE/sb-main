import { ItemIdentifier, ItemStack } from "@serenityjs/core";
import { EnchantmentRarity } from "../../Types/types";
import { EnchantmentRarityColor } from "../Enchantment/customEnchantment";
import { CompoundTag, StringTag } from "@serenityjs/nbt";

class SealedTome extends ItemStack {
    constructor(rarity: EnchantmentRarity, amount?: number) {
        super(ItemIdentifier.Book, { stackSize: amount ?? 1 });
        const rarityType = EnchantmentRarity[rarity] as keyof typeof EnchantmentRarity;
        // Set NBT.
        const tag = new CompoundTag()
        tag.set("Rarity", new StringTag(rarityType, "Rarity"))
        this.nbt.set("SealedTome", tag)

        // Set display.
        this.setDisplayName(`§r§l${EnchantmentRarityColor[rarityType]}${rarityType} Tome§r`);
        this.setLore([
            "§r§6Tap on a block to open."
        ])
    }
}

export { SealedTome }