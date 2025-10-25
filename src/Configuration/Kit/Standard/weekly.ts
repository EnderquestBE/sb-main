import { ItemIdentifier, ItemStack, ItemStackEnchantableTrait } from "@serenityjs/core";
import { Kit } from "../kit";
import { Enchantment } from "@serenityjs/protocol";
import { CommonCrateKey, MoneyVoucher, RareCrateKey } from "../../../Classes";

// Weekly Kit
new Kit({
    id: "weekly", name: "Weekly Kit", displayName: "§bWeekly", cooldown: 168, onPlace: (_block, container) => {
        // Armor
        const helmet = new ItemStack(ItemIdentifier.IronHelmet);
        helmet.setDisplayName("Weekly Helmet");
        const helmetEnchants = helmet.addTrait(ItemStackEnchantableTrait);
        helmetEnchants.addEnchantment(Enchantment.Unbreaking, 2);
        helmetEnchants.addEnchantment(Enchantment.Protection, 2);
        container.setItem(0, helmet);
        const chestplate = new ItemStack(ItemIdentifier.IronChestplate);
        chestplate.setDisplayName("Weekly Chestplate");
        const chestplateEnchants = chestplate.addTrait(ItemStackEnchantableTrait);
        chestplateEnchants.addEnchantment(Enchantment.Unbreaking, 2);
        chestplateEnchants.addEnchantment(Enchantment.Protection, 2);
        container.setItem(1, chestplate);
        const leggings = new ItemStack(ItemIdentifier.IronLeggings);
        leggings.setDisplayName("Weekly Leggings");
        const leggingsEnchants = leggings.addTrait(ItemStackEnchantableTrait);
        leggingsEnchants.addEnchantment(Enchantment.Unbreaking, 2);
        leggingsEnchants.addEnchantment(Enchantment.Protection, 2);
        container.setItem(2, leggings);
        const boots = new ItemStack(ItemIdentifier.IronBoots);
        boots.setDisplayName("Weekly Boots");
        const bootsEnchants = boots.addTrait(ItemStackEnchantableTrait);
        bootsEnchants.addEnchantment(Enchantment.Unbreaking, 2);
        bootsEnchants.addEnchantment(Enchantment.Protection, 2);
        container.setItem(3, boots);
        // Items
        const sword = new ItemStack(ItemIdentifier.IronSword, { stackSize: 1 });
        sword.setDisplayName("Weekly Sword");
        const swordEnchants = sword.addTrait(ItemStackEnchantableTrait);
        swordEnchants.addEnchantment(Enchantment.Unbreaking, 2);
        swordEnchants.addEnchantment(Enchantment.Sharpness, 2);
        const pickaxe = new ItemStack(ItemIdentifier.IronPickaxe, { stackSize: 1 });
        pickaxe.setDisplayName("Weekly Pickaxe");
        const pickEnchants = pickaxe.addTrait(ItemStackEnchantableTrait);
        pickEnchants.addEnchantment(Enchantment.Unbreaking, 3);
        pickEnchants.addEnchantment(Enchantment.Efficiency, 3);
        const axe = new ItemStack(ItemIdentifier.IronAxe, { stackSize: 1 });
        axe.setDisplayName("Weekly Axe");
        const axeEnchants = axe.addTrait(ItemStackEnchantableTrait);
        axeEnchants.addEnchantment(Enchantment.Unbreaking, 3);
        axeEnchants.addEnchantment(Enchantment.Efficiency, 3);
        container.setItem(4, sword);
        container.setItem(5, pickaxe);
        container.setItem(6, axe);
        container.setItem(7, new ItemStack(ItemIdentifier.OakLog, { stackSize: 16 }));
        container.setItem(8, new ItemStack(ItemIdentifier.GrassBlock, { stackSize: 32 }));
        container.setItem(9, new ItemStack(ItemIdentifier.QuartzBlock, { stackSize: 8 }));
        container.setItem(10, new ItemStack(ItemIdentifier.Apple, { stackSize: 8 }));
        container.setItem(11, new ItemStack(ItemIdentifier.Carrot, { stackSize: 2 }));
        container.setItem(12, new ItemStack(ItemIdentifier.Potato, { stackSize: 2 }));
        container.setItem(13, new ItemStack(ItemIdentifier.PumpkinSeeds, { stackSize: 2 }));
        container.setItem(14, new ItemStack(ItemIdentifier.MelonSeeds, { stackSize: 2 }));
        container.setItem(15, new MoneyVoucher(10000));
        container.setItem(16, new CommonCrateKey(2));
        container.setItem(17, new RareCrateKey());
    }
});