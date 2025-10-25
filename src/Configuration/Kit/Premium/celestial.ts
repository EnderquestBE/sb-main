import { ItemIdentifier, ItemStack, ItemStackEnchantableTrait } from "@serenityjs/core";
import { Kit } from "../kit";
import { Enchantment } from "@serenityjs/protocol";
import { CommonCrateKey, EpicCrateKey, MoneyVoucher, RareCrateKey } from "../../../Classes";

// Celestial Kit
new Kit({
    id: "celestial", name: "Celestial Kit", displayName: "§dCel§best§eial", cooldown: 24, onPlace: (_block, container) => {
        // Armor
        const helmet = new ItemStack(ItemIdentifier.DiamondHelmet);
        helmet.setDisplayName("Celestial Helmet");
        const helmetEnchants = helmet.addTrait(ItemStackEnchantableTrait);
        helmetEnchants.addEnchantment(Enchantment.Unbreaking, 5);
        helmetEnchants.addEnchantment(Enchantment.Protection, 5);
        container.setItem(0, helmet);
        const chestplate = new ItemStack(ItemIdentifier.DiamondChestplate);
        chestplate.setDisplayName("Celestial Chestplate");
        const chestplateEnchants = chestplate.addTrait(ItemStackEnchantableTrait);
        chestplateEnchants.addEnchantment(Enchantment.Unbreaking, 5);
        chestplateEnchants.addEnchantment(Enchantment.Protection, 5);
        container.setItem(1, chestplate);
        const leggings = new ItemStack(ItemIdentifier.DiamondLeggings);
        leggings.setDisplayName("Celestial Leggings");
        const leggingsEnchants = leggings.addTrait(ItemStackEnchantableTrait);
        leggingsEnchants.addEnchantment(Enchantment.Unbreaking, 5);
        leggingsEnchants.addEnchantment(Enchantment.Protection, 5);
        container.setItem(2, leggings);
        const boots = new ItemStack(ItemIdentifier.DiamondBoots);
        boots.setDisplayName("Celestial Boots");
        const bootsEnchants = boots.addTrait(ItemStackEnchantableTrait);
        bootsEnchants.addEnchantment(Enchantment.Unbreaking, 5);
        bootsEnchants.addEnchantment(Enchantment.Protection, 5);
        container.setItem(3, boots);
        // Items
        const sword = new ItemStack(ItemIdentifier.DiamondSword, { stackSize: 1 });
        sword.setDisplayName("Celestial Sword");
        const swordEnchants = sword.addTrait(ItemStackEnchantableTrait);
        swordEnchants.addEnchantment(Enchantment.Unbreaking, 5);
        swordEnchants.addEnchantment(Enchantment.Sharpness, 4);
        swordEnchants.addEnchantment(Enchantment.FireAspect, 3);
        const pickaxe = new ItemStack(ItemIdentifier.DiamondPickaxe, { stackSize: 1 });
        pickaxe.setDisplayName("Celestial Pickaxe");
        const pickEnchants = pickaxe.addTrait(ItemStackEnchantableTrait);
        pickEnchants.addEnchantment(Enchantment.Unbreaking, 5);
        pickEnchants.addEnchantment(Enchantment.Efficiency, 4);
        const axe = new ItemStack(ItemIdentifier.DiamondAxe, { stackSize: 1 });
        axe.setDisplayName("Celestial Axe");
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
        container.setItem(13, new ItemStack(ItemIdentifier.EnchantedGoldenApple, { stackSize: 2 }));
        container.setItem(14, new MoneyVoucher(20000));
        container.setItem(15, new CommonCrateKey(2));
        container.setItem(16, new RareCrateKey(1));
        container.setItem(17, new EpicCrateKey(1));
    }
});