import { EntityIdentifier, EntityType, ItemIdentifier, ItemStack } from "@serenityjs/core";
import { ShortTag, StringTag } from "@serenityjs/nbt";
import { Utils } from "../../Utils/utils";

const SpawnerColorMap = {
    [EntityIdentifier.Zombie]: "§2",
    [EntityIdentifier.Pig]: "§d",
    [EntityIdentifier.Chicken]: "§f",
    [EntityIdentifier.Cow]: "§6",
    [EntityIdentifier.Spider]: "§4",
    [EntityIdentifier.Creeper]: "§a",
    [EntityIdentifier.Skeleton]: "§7",
    [EntityIdentifier.Squid]: "§1",
    [EntityIdentifier.IronGolem]: "§f",
    [EntityIdentifier.Blaze]: "§e",
    [EntityIdentifier.ZombiePigman]: "§c"
}

class SpawnerHandler {

    public static readonly MAX_LEVEL = 5; // Max level a spawner can be upgraded to.

    public static readonly SPEEDS = [12, 10, 8, 6, 4]; // In seconds.

    public static readonly PRICES = [750000, 1500000, 3750000, 6000000];

    public static createItem(type: EntityIdentifier, level: number = 1, amount: number = 1) {
        const item = new ItemStack(ItemIdentifier.MobSpawner, { stackSize: amount })

        item.nbt.set("EntityIdentifier", new StringTag(type, "EntityIdentifier"))
        item.nbt.set("Level", new ShortTag(level, "Level"))

        item.setDisplayName(`§r§l${SpawnerColorMap[type as keyof typeof SpawnerColorMap] ?? "§5"}${Utils.formatString(type)} §dSpawner`)
        item.setLore([`§r§l§6Level: §r§e${Utils.toRomanNumeral(level)}`])

        return item
    }

    public static initialize() {
        const entityIdentifiers = [EntityIdentifier.Cow, EntityIdentifier.Pig, EntityIdentifier.Chicken]
        for (const identifier of entityIdentifiers) {
            const type = EntityType.get(identifier)!
            type.createEnumProperty("minecraft:climate_variant", ["temperate", "warm", "cold"], "temperate")
        }
    }
}

export { SpawnerHandler, SpawnerColorMap }