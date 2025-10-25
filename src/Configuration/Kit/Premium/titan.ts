import { ItemIdentifier, ItemStack, ItemStackEnchantableTrait } from "@serenityjs/core";
import { Kit } from "../kit";
import { Enchantment } from "@serenityjs/protocol";
import { CommonCrateKey, MoneyVoucher, RareCrateKey } from "../../../Classes";

// Titan Kit
new Kit({
    id: "titan", name: "Titan Kit", displayName: "§cTitan", cooldown: 24, onPlace: (_block, container) => {
        // Armor
        const helmet = new ItemStack(ItemIdentifier.DiamondHelmet);
        helmet.setDisplayName("Titan Helmet");
        const helmetEnchants = helmet.addTrait(ItemStackEnchantableTrait);
        helmetEnchants.addEnchantment(Enchantment.Unbreaking, 4);
        helmetEnchants.addEnchantment(Enchantment.Protection, 4);
        container.setItem(0, helmet);
        const chestplate = new ItemStack(ItemIdentifier.DiamondChestplate);
        chestplate.setDisplayName("Titan Chestplate");
        const chestplateEnchants = chestplate.addTrait(ItemStackEnchantableTrait);
        chestplateEnchants.addEnchantment(Enchantment.Unbreaking, 4);
        chestplateEnchants.addEnchantment(Enchantment.Protection, 4);
        container.setItem(1, chestplate);
        const leggings = new ItemStack(ItemIdentifier.DiamondLeggings);
        leggings.setDisplayName("Titan Leggings");
        const leggingsEnchants = leggings.addTrait(ItemStackEnchantableTrait);
        leggingsEnchants.addEnchantment(Enchantment.Unbreaking, 4);
        leggingsEnchants.addEnchantment(Enchantment.Protection, 4);
        container.setItem(2, leggings);
        const boots = new ItemStack(ItemIdentifier.DiamondBoots);
        boots.setDisplayName("Titan Boots");
        const bootsEnchants = boots.addTrait(ItemStackEnchantableTrait);
        bootsEnchants.addEnchantment(Enchantment.Unbreaking, 4);
        bootsEnchants.addEnchantment(Enchantment.Protection, 4);
        container.setItem(3, boots);
        // Items
        const sword = new ItemStack(ItemIdentifier.DiamondSword, { stackSize: 1 });
        sword.setDisplayName("Titan Sword");
        const swordEnchants = sword.addTrait(ItemStackEnchantableTrait);
        swordEnchants.addEnchantment(Enchantment.Unbreaking, 4);
        swordEnchants.addEnchantment(Enchantment.Sharpness, 4);
        swordEnchants.addEnchantment(Enchantment.FireAspect, 1);
        const pickaxe = new ItemStack(ItemIdentifier.DiamondPickaxe, { stackSize: 1 });
        pickaxe.setDisplayName("Titan Pickaxe");
        const pickEnchants = pickaxe.addTrait(ItemStackEnchantableTrait);
        pickEnchants.addEnchantment(Enchantment.Unbreaking, 4);
        pickEnchants.addEnchantment(Enchantment.Efficiency, 4);
        const axe = new ItemStack(ItemIdentifier.DiamondAxe, { stackSize: 1 });
        axe.setDisplayName("Titan Axe");
        const axeEnchants = axe.addTrait(ItemStackEnchantableTrait);
        axeEnchants.addEnchantment(Enchantment.Unbreaking, 4);
        axeEnchants.addEnchantment(Enchantment.Efficiency, 4);
        container.setItem(4, sword);
        container.setItem(5, pickaxe);
        container.setItem(6, axe);
        container.setItem(7, new ItemStack(ItemIdentifier.OakLog, { stackSize: 32 }));
        container.setItem(8, new ItemStack(ItemIdentifier.Obsidian, { stackSize: 16 }));
        container.setItem(9, new ItemStack(ItemIdentifier.Bedrock, { stackSize: 16 }));
        container.setItem(10, new ItemStack(ItemIdentifier.QuartzBlock, { stackSize: 8 }));
        container.setItem(11, new ItemStack(ItemIdentifier.Bread, { stackSize: 32 }));
        container.setItem(12, new ItemStack(ItemIdentifier.GoldenApple, { stackSize: 2 }));
        container.setItem(13, new ItemStack(ItemIdentifier.EnchantedGoldenApple, { stackSize: 1 }));
        container.setItem(14, new MoneyVoucher(15000));
        container.setItem(15, new CommonCrateKey(2));
        container.setItem(16, new RareCrateKey(2));
    }
});