import { ItemIdentifier, ItemStack, ItemStackEnchantableTrait } from "@serenityjs/core";
import { Kit } from "../kit";
import { Enchantment } from "@serenityjs/protocol";
import { CommonCrateKey, EpicCrateKey, MoneyVoucher, RareCrateKey } from "../../../Classes";

// Immortal Kit
new Kit({
    id: "immortal", name: "Immortal Kit", displayName: "§eImmortal", cooldown: 24, onPlace: (_block, container) => {
        // Armor
        const helmet = new ItemStack(ItemIdentifier.DiamondHelmet);
        helmet.setDisplayName("Immortal Helmet");
        const helmetEnchants = helmet.addTrait(ItemStackEnchantableTrait);
        helmetEnchants.addEnchantment(Enchantment.Unbreaking, 5);
        helmetEnchants.addEnchantment(Enchantment.Protection, 4);
        container.setItem(0, helmet);
        const chestplate = new ItemStack(ItemIdentifier.DiamondChestplate);
        chestplate.setDisplayName("Immortal Chestplate");
        const chestplateEnchants = chestplate.addTrait(ItemStackEnchantableTrait);
        chestplateEnchants.addEnchantment(Enchantment.Unbreaking, 5);
        chestplateEnchants.addEnchantment(Enchantment.Protection, 4);
        container.setItem(1, chestplate);
        const leggings = new ItemStack(ItemIdentifier.DiamondLeggings);
        leggings.setDisplayName("Immortal Leggings");
        const leggingsEnchants = leggings.addTrait(ItemStackEnchantableTrait);
        leggingsEnchants.addEnchantment(Enchantment.Unbreaking, 5);
        leggingsEnchants.addEnchantment(Enchantment.Protection, 4);
        container.setItem(2, leggings);
        const boots = new ItemStack(ItemIdentifier.DiamondBoots);
        boots.setDisplayName("Immortal Boots");
        const bootsEnchants = boots.addTrait(ItemStackEnchantableTrait);
        bootsEnchants.addEnchantment(Enchantment.Unbreaking, 5);
        bootsEnchants.addEnchantment(Enchantment.Protection, 4);
        container.setItem(3, boots);
        // Items
        const sword = new ItemStack(ItemIdentifier.DiamondSword, { stackSize: 1 });
        sword.setDisplayName("Immortal Sword");
        const swordEnchants = sword.addTrait(ItemStackEnchantableTrait);
        swordEnchants.addEnchantment(Enchantment.Unbreaking, 5);
        swordEnchants.addEnchantment(Enchantment.Sharpness, 4);
        swordEnchants.addEnchantment(Enchantment.FireAspect, 2);
        const pickaxe = new ItemStack(ItemIdentifier.DiamondPickaxe, { stackSize: 1 });
        pickaxe.setDisplayName("Immortal Pickaxe");
        const pickEnchants = pickaxe.addTrait(ItemStackEnchantableTrait);
        pickEnchants.addEnchantment(Enchantment.Unbreaking, 5);
        pickEnchants.addEnchantment(Enchantment.Efficiency, 4);
        const axe = new ItemStack(ItemIdentifier.DiamondAxe, { stackSize: 1 });
        axe.setDisplayName("Immortal Axe");
        const axeEnchants = axe.addTrait(ItemStackEnchantableTrait);
        axeEnchants.addEnchantment(Enchantment.Unbreaking, 5);
        axeEnchants.addEnchantment(Enchantment.Efficiency, 4);
        container.setItem(4, sword);
        container.setItem(5, pickaxe);
        container.setItem(6, axe);
        container.setItem(7, new ItemStack(ItemIdentifier.OakLog, { stackSize: 32 }));
        container.setItem(8, new ItemStack(ItemIdentifier.Obsidian, { stackSize: 32 }));
        container.setItem(9, new ItemStack(ItemIdentifier.Bedrock, { stackSize: 16 }));
        container.setItem(10, new ItemStack(ItemIdentifier.QuartzBlock, { stackSize: 16 }));
        container.setItem(11, new ItemStack(ItemIdentifier.Bread, { stackSize: 32 }));
        container.setItem(12, new ItemStack(ItemIdentifier.GoldenApple, { stackSize: 4 }));
        container.setItem(13, new ItemStack(ItemIdentifier.EnchantedGoldenApple, { stackSize: 1 }));
        container.setItem(14, new MoneyVoucher(17500));
        container.setItem(15, new CommonCrateKey(1));
        container.setItem(16, new RareCrateKey(1));
        container.setItem(17, new EpicCrateKey(1));
    }
});