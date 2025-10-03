import { BlockIdentifier } from "@serenityjs/core";
import { CategoryBuilder } from "../../../../Classes/Shop/CategoryBuilder";

const ShopWoodCategory = new CategoryBuilder({ id: "wood", display: { name: "Wood" } })
    .addItem({ id: BlockIdentifier.OakLog, price: 400 })

const ShopStoneCategory = new CategoryBuilder({ id: "stone", display: { name: "Stone" } })
    .addItem({ id: BlockIdentifier.Stone, price: 200, transactionSound: "dig.stone" })
    .addItem({ id: BlockIdentifier.Granite, price: 225, transactionSound: "dig.stone" })
    .addItem({ id: BlockIdentifier.Diorite, price: 225, transactionSound: "dig.stone" })
    .addItem({ id: BlockIdentifier.Andesite, price: 225, transactionSound: "dig.stone" })
    .addItem({ id: BlockIdentifier.DripstoneBlock, price: 250, transactionSound: "break.dripstone_block" })
    .addItem({ id: BlockIdentifier.Calcite, price: 275, transactionSound: "break.calcite" })
    .addItem({ id: BlockIdentifier.Tuff, price: 300, transactionSound: "break.tuff" })
    .addItem({ id: BlockIdentifier.Blackstone, price: 350, transactionSound: "dig.stone" })
    .addItem({ id: BlockIdentifier.Deepslate, price: 400, transactionSound: "dig.dripstone_block" })
    .addItem({ id: BlockIdentifier.Basalt, price: 450, transactionSound: "dig.stone" })
    .addItem({ id: BlockIdentifier.EndStone, price: 500, transactionSound: "dig.stone" });

const ShopSandCategory = new CategoryBuilder({ id: "sand", display: { name: "Sand" } })
    .addItem({ id: BlockIdentifier.Sand, price: 250, transactionSound: "dig.sand" })
    .addItem({ id: BlockIdentifier.RedSand, price: 250, transactionSound: "dig.sand" })
    .addItem({ id: BlockIdentifier.Sandstone, price: 800, transactionSound: "dig.stone" })
    .addItem({ id: BlockIdentifier.RedSandstone, price: 800, transactionSound: "dig.stone" })
    .addItem({ id: BlockIdentifier.Clay, price: 1000, transactionSound: "dig.gravel" })
    .addItem({ id: BlockIdentifier.Mud, price: 1200, transactionSound: "block.mud.hit" });

const ShopBlockCategory = new CategoryBuilder({ id: "blocks", display: { name: "Blocks" } })
    .addSubCategory(ShopWoodCategory)
    .addSubCategory(ShopStoneCategory)
    .addSubCategory(ShopSandCategory)
    .addItem({ id: BlockIdentifier.Dirt, price: 200, transactionSound: "dig.gravel" })
    .addItem({ id: BlockIdentifier.SoulSand, price: 200, transactionSound: "dig.soul_sand" })
    .addItem({ id: BlockIdentifier.Glowstone, price: 200, transactionSound: "random.glass" })
    .addItem({ id: BlockIdentifier.StoneBricks, price: 200, transactionSound: "dig.stone" })
    .addItem({ id: BlockIdentifier.GrassBlock, price: 250, transactionSound: "dig.grass" })
    .addItem({ id: BlockIdentifier.Gravel, price: 250, transactionSound: "dig.gravel" })
    .addItem({ id: BlockIdentifier.Obsidian, price: 250, transactionSound: "dig.stone" })
    .addItem({ id: BlockIdentifier.Ice, price: 300, transactionSound: "random.glass" })
    .addItem({ id: BlockIdentifier.Snow, price: 400, transactionSound: "dig.snow" })
    .addItem({ id: BlockIdentifier.NetherBrick, price: 750, transactionSound: "dig.nether_brick" })
    .addItem({ id: BlockIdentifier.BrickBlock, price: 1000, transactionSound: "dig.stone" })
    .addItem({ id: BlockIdentifier.Prismarine, price: 1250, transactionSound: "dig.stone" })
    .addItem({ id: BlockIdentifier.DarkPrismarine, price: 1400, transactionSound: "dig.stone" })
    .addItem({ id: BlockIdentifier.Bedrock, price: 2000, transactionSound: "dig.stone" })
    .addItem({ id: BlockIdentifier.SeaLantern, price: 2800, transactionSound: "random.glass" })
    .addItem({ id: BlockIdentifier.PackedIce, price: 3000, transactionSound: "random.glass" })
    .addItem({ id: BlockIdentifier.BoneBlock, price: 16000, transactionSound: "dig.bone_block" })

export { ShopBlockCategory };