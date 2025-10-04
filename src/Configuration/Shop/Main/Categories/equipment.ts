import { ItemIdentifier } from "@serenityjs/core";
import { CategoryBuilder } from "../../../../Classes/Shop/CategoryBuilder";

const ShopLeatherCategory = new CategoryBuilder({ id: "leather", display: { name: "Leather" } })
    .addItem({ id: ItemIdentifier.LeatherHelmet, price: 750, transactionSound: "armor.equip_leather", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.LeatherChestplate, price: 1250, transactionSound: "armor.equip_leather", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.LeatherLeggings, price: 1000, transactionSound: "armor.equip_leather", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.LeatherBoots, price: 750, transactionSound: "armor.equip_leather", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.WoodenSword, price: 200, transactionSound: "dig.wood", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.WoodenPickaxe, price: 300, transactionSound: "dig.wood", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.WoodenAxe, price: 300, transactionSound: "dig.wood", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.WoodenShovel, price: 100, transactionSound: "dig.wood", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.WoodenHoe, price: 200, transactionSound: "dig.wood", slider: { step: 1, max: 1 } });

const ShopChainmailCategory = new CategoryBuilder({ id: "chainmail", display: { name: "Chainmail" } })
    .addItem({ id: ItemIdentifier.ChainmailHelmet, price: 1250, transactionSound: "armor.equip_chain", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.ChainmailChestplate, price: 1750, transactionSound: "armor.equip_chain", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.ChainmailLeggings, price: 1500, transactionSound: "armor.equip_chain", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.ChainmailBoots, price: 1250, transactionSound: "armor.equip_chain", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.StoneSword, price: 350, transactionSound: "dig.stone", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.StonePickaxe, price: 650, transactionSound: "dig.stone", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.StoneAxe, price: 450, transactionSound: "dig.stone", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.StoneShovel, price: 225, transactionSound: "dig.stone", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.StoneHoe, price: 350, transactionSound: "dig.stone", slider: { step: 1, max: 1 } });

const ShopIronCategory = new CategoryBuilder({ id: "iron", display: { name: "Iron" } })
    .addItem({ id: ItemIdentifier.IronHelmet, price: 3500, transactionSound: "armor.equip_iron", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.IronChestplate, price: 4250, transactionSound: "armor.equip_iron", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.IronLeggings, price: 3750, transactionSound: "armor.equip_iron", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.IronBoots, price: 3500, transactionSound: "armor.equip_iron", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.IronSword, price: 1850, transactionSound: "armor.equip_iron", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.IronPickaxe, price: 2800, transactionSound: "armor.equip_iron", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.IronAxe, price: 2500, transactionSound: "armor.equip_iron", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.IronShovel, price: 1400, transactionSound: "armor.equip_iron", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.IronHoe, price: 1750, transactionSound: "armor.equip_iron", slider: { step: 1, max: 1 } });

const ShopDiamondCategory = new CategoryBuilder({ id: "diamond", display: { name: "Diamond" } })
    .addItem({ id: ItemIdentifier.DiamondHelmet, price: 6500, transactionSound: "armor.equip_diamond", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.DiamondChestplate, price: 7500, transactionSound: "armor.equip_diamond", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.DiamondLeggings, price: 7000, transactionSound: "armor.equip_diamond", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.DiamondBoots, price: 6000, transactionSound: "armor.equip_diamond", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.DiamondSword, price: 6000, transactionSound: "armor.equip_diamond", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.DiamondPickaxe, price: 8500, transactionSound: "armor.equip_diamond", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.DiamondAxe, price: 7750, transactionSound: "armor.equip_diamond", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.DiamondShovel, price: 4500, transactionSound: "armor.equip_diamond", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.DiamondHoe, price: 5500, transactionSound: "armor.equip_diamond", slider: { step: 1, max: 1 } });

const ShopEquipmentCategory = new CategoryBuilder({ id: "equipment", display: { name: "Equipment" } })
    .addSubCategory(ShopLeatherCategory)
    .addSubCategory(ShopChainmailCategory)
    .addSubCategory(ShopIronCategory)
    .addSubCategory(ShopDiamondCategory)
    .addItem({ id: ItemIdentifier.Elytra, price: 10000000, transactionSound: "armor.equip_leather", slider: { step: 1, max: 1 } })
    .addItem({ id: ItemIdentifier.Spyglass, price: 22000, transactionSound: "item.spyglass.use", slider: { step: 1, max: 1 } })
//.addItem({ id: ItemIdentifier.Saddle, price: 7000, transactionSound: "mob.horse.leather", slider: { step: 1, max: 1 } });

export { ShopEquipmentCategory };