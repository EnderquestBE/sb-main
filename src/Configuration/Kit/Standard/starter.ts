import { ItemIdentifier, ItemStack, ItemStackEnchantableTrait } from "@serenityjs/core";
import { Kit } from "../kit";
import { Enchantment } from "@serenityjs/protocol";
import { CommonCrateKey, MoneyVoucher } from "../../../Classes";

// Starter Kit
new Kit({
    id: "starter", name: "Starter Kit", displayName: "§fStarter", cooldown: 24, onPlace: (_block, container) => {
        // Armor
        const helmet = new ItemStack(ItemIdentifier.LeatherHelmet);
        helmet.setDisplayName("Starter Helmet")
        const helmetEnchants = helmet.addTrait(ItemStackEnchantableTrait);
        helmetEnchants.addEnchantment(Enchantment.Unbreaking, 2);
        container.setItem(0, helmet);
        const chestplate = new ItemStack(ItemIdentifier.LeatherChestplate);
        chestplate.setDisplayName("Starter Chestplate")
        const chestplateEnchants = chestplate.addTrait(ItemStackEnchantableTrait);
        chestplateEnchants.addEnchantment(Enchantment.Unbreaking, 2);
        container.setItem(1, chestplate);
        const leggings = new ItemStack(ItemIdentifier.LeatherLeggings);
        leggings.setDisplayName("Starter Leggings")
        const leggingsEnchants = leggings.addTrait(ItemStackEnchantableTrait);
        leggingsEnchants.addEnchantment(Enchantment.Unbreaking, 2);
        container.setItem(2, leggings);
        const boots = new ItemStack(ItemIdentifier.LeatherBoots);
        boots.setDisplayName("Starter Boots")
        const bootsEnchants = boots.addTrait(ItemStackEnchantableTrait);
        bootsEnchants.addEnchantment(Enchantment.Unbreaking, 2);
        container.setItem(3, boots);
        // Items
        const pickaxe = new ItemStack(ItemIdentifier.WoodenPickaxe, { stackSize: 1 });
        pickaxe.setDisplayName("Starter Pickaxe")
        const pickEnchants = pickaxe.addTrait(ItemStackEnchantableTrait);
        pickEnchants.addEnchantment(Enchantment.Unbreaking, 2);
        pickEnchants.addEnchantment(Enchantment.Efficiency, 2);
        container.setItem(4, pickaxe);
        const hoe = new ItemStack(ItemIdentifier.WoodenHoe, { stackSize: 1 });
        hoe.setDisplayName("Starter Hoe")
        const hoeEnchants = hoe.addTrait(ItemStackEnchantableTrait);
        hoeEnchants.addEnchantment(Enchantment.Unbreaking, 2);
        container.setItem(5, hoe);
        container.setItem(6, new ItemStack(ItemIdentifier.OakLog, { stackSize: 4 }));
        container.setItem(7, new ItemStack(ItemIdentifier.GrassBlock, { stackSize: 16 }));
        container.setItem(8, new ItemStack(ItemIdentifier.Bread, { stackSize: 4 }));
        container.setItem(9, new ItemStack(ItemIdentifier.BeetrootSeeds, { stackSize: 2 }));
        container.setItem(10, new ItemStack(ItemIdentifier.WheatSeeds, { stackSize: 2 }));
        container.setItem(11, new ItemStack(ItemIdentifier.Carrot, { stackSize: 2 }));
        container.setItem(12, new ItemStack(ItemIdentifier.Potato, { stackSize: 2 }));
        container.setItem(13, new ItemStack(ItemIdentifier.Cactus, { stackSize: 1 }));
        container.setItem(14, new MoneyVoucher(2500));
        container.setItem(15, new CommonCrateKey());
    }
});