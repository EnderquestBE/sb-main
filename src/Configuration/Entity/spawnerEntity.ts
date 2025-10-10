import { EntityIdentifier, ItemIdentifier } from "@serenityjs/core";
import { SpawnerEntity } from "../../Handlers/Entity/spawnerEntity";

/* Zombie */
new SpawnerEntity(EntityIdentifier.Zombie, { health: 20, height: 1.9, loot: [{ item: ItemIdentifier.RottenFlesh, amount: [0, 2], applyLooting: true }], xp: [0, 2] })
/* Pig */
new SpawnerEntity(EntityIdentifier.Pig, { health: 8, height: 0.9, loot: [{ item: ItemIdentifier.Porkchop, cooked: ItemIdentifier.CookedPorkchop, amount: [1, 3], applyLooting: true }], xp: [1, 2] })
/* Chicken */
new SpawnerEntity(EntityIdentifier.Chicken, { health: 4, height: 0.8, loot: [{ item: ItemIdentifier.Chicken, cooked: ItemIdentifier.CookedChicken, amount: [1, 1], applyLooting: true }, { item: ItemIdentifier.Feather, amount: [0, 2], applyLooting: true }], xp: [1, 3] })
/* Cow */
new SpawnerEntity(EntityIdentifier.Cow, { health: 10, height: 1.3, loot: [{ item: ItemIdentifier.Beef, cooked: ItemIdentifier.CookedBeef, amount: [1, 3], applyLooting: true }, { item: ItemIdentifier.Leather, amount: [0, 2], applyLooting: true }], xp: [2, 3] })
/* Spider */
new SpawnerEntity(EntityIdentifier.Spider, { health: 16, height: 0.9, loot: [{ item: ItemIdentifier.String, amount: [1, 3], applyLooting: true }, { item: ItemIdentifier.SpiderEye, amount: [0, 1], applyLooting: true }], xp: [4, 4] })
/* Creeper */
new SpawnerEntity(EntityIdentifier.Creeper, { health: 24, height: 1.8, loot: [{ item: ItemIdentifier.Gunpowder, amount: [1, 3], applyLooting: true }], xp: [4, 5] })
/* Skeleton */
new SpawnerEntity(EntityIdentifier.Skeleton, { health: 28, height: 1.9, loot: [{ item: ItemIdentifier.Bone, amount: [1, 2], applyLooting: true }, { item: ItemIdentifier.Arrow, amount: [0, 2], applyLooting: true }], xp: [5, 5] })
/* Squid */
new SpawnerEntity(EntityIdentifier.Squid, { health: 12, height: 0.95, loot: [{ item: ItemIdentifier.InkSac, amount: [1, 3], applyLooting: true }], xp: [0, 0] })
/* Iron Golem */
new SpawnerEntity(EntityIdentifier.IronGolem, { health: 50, height: 3.1, loot: [{ item: ItemIdentifier.IronIngot, amount: [3, 7], applyLooting: true }, { item: ItemIdentifier.Poppy, amount: [0, 2], applyLooting: true }], xp: [3, 7] })
/* Blaze */
new SpawnerEntity(EntityIdentifier.Blaze, { health: 30, height: 1.8, loot: [{ item: ItemIdentifier.BlazeRod, amount: [2, 2], applyLooting: true }], xp: [7, 12] })
/* Zombie Pigman */
new SpawnerEntity(EntityIdentifier.ZombiePigman, { health: 20, height: 1.9, loot: [{ item: ItemIdentifier.GoldIngot, amount: [3, 3], applyLooting: true }], xp: [8, 13] })