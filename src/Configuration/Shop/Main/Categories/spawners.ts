import { EntityIdentifier } from "@serenityjs/core";
import { SpawnerHandler } from "../../../../Handlers/Spawner/spawner";
import { CategoryBuilder } from "../../../../Classes/Shop/CategoryBuilder";

const ShopSpawnersCategory = new CategoryBuilder({ id: "spawners", display: { name: "Spawners" } })
    .addItem({ id: "zombie_spawner", price: 3500000, item: SpawnerHandler.createItem(EntityIdentifier.Zombie), transactionSound: "block.mob_spawner.break" })
    .addItem({ id: "pig_spawner", price: 4000000, item: SpawnerHandler.createItem(EntityIdentifier.Pig), transactionSound: "block.mob_spawner.break" })
    .addItem({ id: "chicken_spawner", price: 4500000, item: SpawnerHandler.createItem(EntityIdentifier.Chicken), transactionSound: "block.mob_spawner.break" })
    .addItem({ id: "cow_spawner", price: 6000000, item: SpawnerHandler.createItem(EntityIdentifier.Cow), transactionSound: "block.mob_spawner.break" })
    .addItem({ id: "spider_spawner", price: 7500000, item: SpawnerHandler.createItem(EntityIdentifier.Spider), transactionSound: "block.mob_spawner.break" })
    .addItem({ id: "creeper_spawner", price: 8000000, item: SpawnerHandler.createItem(EntityIdentifier.Creeper), transactionSound: "block.mob_spawner.break" })
    .addItem({ id: "skeleton_spawner", price: 9500000, item: SpawnerHandler.createItem(EntityIdentifier.Skeleton), transactionSound: "block.mob_spawner.break" })
    .addItem({ id: "squid_spawner", price: 10500000, item: SpawnerHandler.createItem(EntityIdentifier.Squid), transactionSound: "block.mob_spawner.break" })
    .addItem({ id: "iron_golem_spawner", price: 11000000, item: SpawnerHandler.createItem(EntityIdentifier.IronGolem), transactionSound: "block.mob_spawner.break" })
    .addItem({ id: "blaze_spawner", price: 11500000, item: SpawnerHandler.createItem(EntityIdentifier.Blaze), transactionSound: "block.mob_spawner.break" })
    .addItem({ id: "zombie_pigman_spawner", price: 12500000, item: SpawnerHandler.createItem(EntityIdentifier.ZombiePigman), transactionSound: "block.mob_spawner.break" });

export { ShopSpawnersCategory };