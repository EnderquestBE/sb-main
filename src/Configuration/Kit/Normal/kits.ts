import { ItemIdentifier, ItemStack, ItemStackEnchantableTrait } from "@serenityjs/core";
import { Kit } from "../kit";
import { Enchantment } from "@serenityjs/protocol";
import { CommonCrateKey } from "../../../Classes";

// Starter Kit
new Kit({
    id: "starter", name: "Starter Kit", displayName: "§fStarter", rank: "GUEST", cooldown: 24, onPlace: (_block, container) => {
        const pickaxe = new ItemStack(ItemIdentifier.WoodenPickaxe, { stackSize: 1 });
        const pickEnchants = pickaxe.addTrait(ItemStackEnchantableTrait);
        pickEnchants.addEnchantment(Enchantment.Unbreaking, 2);
        pickEnchants.addEnchantment(Enchantment.Efficiency, 2);
        container.setItem(0, pickaxe);
        const hoe = new ItemStack(ItemIdentifier.WoodenHoe, { stackSize: 1 });
        const hoeEnchants = hoe.addTrait(ItemStackEnchantableTrait);
        hoeEnchants.addEnchantment(Enchantment.Unbreaking, 2);
        container.setItem(1, hoe);
        container.setItem(2, new ItemStack(ItemIdentifier.OakLog, { stackSize: 4 }));
        container.setItem(3, new ItemStack(ItemIdentifier.Bread, { stackSize: 4 }));
        container.setItem(4, new ItemStack(ItemIdentifier.BeetrootSeeds, { stackSize: 2 }));
        container.setItem(5, new ItemStack(ItemIdentifier.WheatSeeds, { stackSize: 2 }));
        container.setItem(6, new ItemStack(ItemIdentifier.Carrot, { stackSize: 2 }));
        container.setItem(7, new ItemStack(ItemIdentifier.Potato, { stackSize: 2 }));
        container.setItem(8, new ItemStack(ItemIdentifier.Cactus, { stackSize: 1 }));
        container.setItem(9, new CommonCrateKey());
        const helmet = new ItemStack(ItemIdentifier.LeatherHelmet);
        const helmetEnchants = helmet.addTrait(ItemStackEnchantableTrait);
        helmetEnchants.addEnchantment(Enchantment.Unbreaking, 2);
        container.setItem(10, helmet);
        const chestplate = new ItemStack(ItemIdentifier.LeatherChestplate);
        const chestplateEnchants = chestplate.addTrait(ItemStackEnchantableTrait);
        chestplateEnchants.addEnchantment(Enchantment.Unbreaking, 2);
        container.setItem(11, chestplate);
        const leggings = new ItemStack(ItemIdentifier.LeatherLeggings);
        const leggingsEnchants = leggings.addTrait(ItemStackEnchantableTrait);
        leggingsEnchants.addEnchantment(Enchantment.Unbreaking, 2);
        container.setItem(12, leggings);
        const boots = new ItemStack(ItemIdentifier.LeatherBoots);
        const bootsEnchants = boots.addTrait(ItemStackEnchantableTrait);
        bootsEnchants.addEnchantment(Enchantment.Unbreaking, 2);
        container.setItem(13, boots);
    }
});