import { EntityEnum, EntityIdentifier, IntegerEnum, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes/classes";
import { SpawnerHandler } from "../../Handlers/Spawner/spawner";

new CommandBuilder("spawner", "Gives the player a spawner.")
    .setPermissions(["serenity.operator"])
    .addOverload(
        new CommandOverload({
            entity: EntityEnum,
            level: IntegerEnum,
            amount: IntegerEnum
        }).onCallback((origin, { entity, level, amount }) => {
            if (!(origin instanceof Player)) return { message: "You must be a player to use this command." }
            try {
                const entityId = `minecraft:${entity.result}` as EntityIdentifier
                const levelNum = level.result ?? 1
                const amountNum = amount.result ?? 1
                if (amountNum < 1 || amountNum > 64) {
                    origin.error("Amount must be between 1 and 64.")
                    return
                }
                if (!entityId) return { message: "Invalid entity." }
                const item = SpawnerHandler.createItem(entityId, levelNum, amountNum)
                origin.inventory.addItem(item)
            } catch (error) {
                //@ts-ignore
                origin.error("Failed to construct item:", error);
            }
        })
    ).register("Admin");
