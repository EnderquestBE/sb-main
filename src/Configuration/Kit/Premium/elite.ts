import { ItemIdentifier, ItemStack, ItemStackEnchantableTrait } from "@serenityjs/core";
import { Kit } from "../kit";
import { Enchantment } from "@serenityjs/protocol";
import { CommonCrateKey, MoneyVoucher, RareCrateKey } from "../../../Classes";

// Elite Kit
new Kit({
    id: "elite", name: "Elite Kit", displayName: "§bElite", cooldown: 24, onPlace: (_block, container) => {
        // Armor
        const helmet = new ItemStack(ItemIdentifier.DiamondHelmet);
        helmet.setDisplayName("Elite Helmet");
        const helmetEnchants = helmet.addTrait(ItemStackEnchantableTrait);
        helmetEnchants.addEnchantment(Enchantment.Unbreaking, 3);
        helmetEnchants.addEnchantment(Enchantment.Protection, 2);
        container.setItem(0, helmet);
        const chestplate = new ItemStack(ItemIdentifier.DiamondChestplate);
        chestplate.setDisplayName("Elite Chestplate");
        const chestplateEnchants = chestplate.addTrait(ItemStackEnchantableTrait);
        chestplateEnchants.addEnchantment(Enchantment.Unbreaking, 3);
        chestplateEnchants.addEnchantment(Enchantment.Protection, 2);
        container.setItem(1, chestplate);
        const leggings = new ItemStack(ItemIdentifier.DiamondLeggings);
        leggings.setDisplayName("Elite Leggings");
        const leggingsEnchants = leggings.addTrait(ItemStackEnchantableTrait);
        leggingsEnchants.addEnchantment(Enchantment.Unbreaking, 3);
        leggingsEnchants.addEnchantment(Enchantment.Protection, 2);
        container.setItem(2, leggings);
        const boots = new ItemStack(ItemIdentifier.DiamondBoots);
        boots.setDisplayName("Elite Boots");
        const bootsEnchants = boots.addTrait(ItemStackEnchantableTrait);
        bootsEnchants.addEnchantment(Enchantment.Unbreaking, 3);
        bootsEnchants.addEnchantment(Enchantment.Protection, 2);
        container.setItem(3, boots);
        // Items
        const sword = new ItemStack(ItemIdentifier.DiamondSword, { stackSize: 1 });
        sword.setDisplayName("Elite Sword");
        const swordEnchants = sword.addTrait(ItemStackEnchantableTrait);
        swordEnchants.addEnchantment(Enchantment.Unbreaking, 3);
        swordEnchants.addEnchantment(Enchantment.Sharpness, 2);
        const pickaxe = new ItemStack(ItemIdentifier.DiamondPickaxe, { stackSize: 1 });
        pickaxe.setDisplayName("Elite Pickaxe");
        const pickEnchants = pickaxe.addTrait(ItemStackEnchantableTrait);
        pickEnchants.addEnchantment(Enchantment.Unbreaking, 3);
        pickEnchants.addEnchantment(Enchantment.Efficiency, 2);
        const axe = new ItemStack(ItemIdentifier.DiamondAxe, { stackSize: 1 });
        axe.setDisplayName("Elite Axe");
        const axeEnchants = axe.addTrait(ItemStackEnchantableTrait);
        axeEnchants.addEnchantment(Enchantment.Unbreaking, 3);
        axeEnchants.addEnchantment(Enchantment.Efficiency, 2);
        container.setItem(4, sword);
        container.setItem(5, pickaxe);
        container.setItem(6, axe);
        container.setItem(7, new ItemStack(ItemIdentifier.OakLog, { stackSize: 16 }));
        container.setItem(8, new ItemStack(ItemIdentifier.GrassBlock, { stackSize: 8 }));
        container.setItem(9, new ItemStack(ItemIdentifier.Obsidian, { stackSize: 8 }));
        container.setItem(10, new ItemStack(ItemIdentifier.QuartzBlock, { stackSize: 8 }));
        container.setItem(11, new ItemStack(ItemIdentifier.Bread, { stackSize: 8 }));
        container.setItem(12, new ItemStack(ItemIdentifier.Apple, { stackSize: 8 }));
        container.setItem(13, new MoneyVoucher(7500));
        container.setItem(14, new CommonCrateKey(1));
        container.setItem(15, new RareCrateKey(1));
    }
});