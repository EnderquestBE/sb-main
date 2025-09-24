import { Player, StringEnum } from "@serenityjs/core";
import { CommandBuilder, CommandOverload, IslandDatabase, PlayerDatabase } from "../../Classes";

new CommandBuilder("resetdb", "Clears all data from a specified database.")
    .setPermissions(["serenity.operator"])
    .addOverload(
        new CommandOverload({
            type: StringEnum
        }).onCallback((origin, { type }) => {
            if (!(origin instanceof Player)) return { message: "You must be a player to use this command." }

            const player = origin;
            const dbType = type.result as "player" | "island";

            if (dbType !== "player" && dbType !== "island") return { message: "Invalid database type. Use 'player' or 'island'." }

            try {
                if (dbType === "player") {
                    PlayerDatabase.instance.clear().then((result) => {
                        player.info(`Successfully cleared the player database. Documents deleted: ${result.deletedCount}`)
                        console.log(`${player.username} cleared the player database (${result.deletedCount} documents).`)
                    })
                } else if (dbType === "island") {
                    IslandDatabase.instance.clear().then((result) => {
                        player.info(`Successfully cleared the island database. Documents deleted: ${result.deletedCount}`)
                        console.log(`${player.username} cleared the island database (${result.deletedCount} documents).`)
                    })
                }
            } catch (error) {
                player.error("An error occurred while clearing the database. Check console.");
                console.error(`Failed to clear ${dbType} database:`, error);
            }
        })
    ).register("Admin");
