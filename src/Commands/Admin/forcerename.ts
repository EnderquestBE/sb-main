import { Player, StringEnum } from "@serenityjs/core";
import { CommandBuilder, CommandOverload, Island, IslandDatabase } from "../../Classes";
import { validifyIslandName } from "../../Utils";
import { Server } from "../../server";
import { Filter } from "mongodb";

new CommandBuilder("forcerename", "Forces a rename of an island.")
    .setPermissions(["serenity.operator"])
    .addOverload(new CommandOverload({
        player: StringEnum,
        name: StringEnum
    }).onCallback((origin, { name, player: username }) => {
        const targetName = username.result as string;
        if (!targetName) return;
        try {
            // Find island from database with owner matching targetName.
            IslandDatabase.instance.collection.find({ "owner.username": targetName } as Filter<any>).limit(1).next().then((islandData) => {
                if (!islandData) {
                    const message = `§e${targetName} §cdoes not currently have an island.`
                    if (origin instanceof Player) origin.error(message);
                    else Server.logger.log(message);
                    return;
                }
                Island.load(islandData.name).then((island) => {
                    if (!island) {
                        const message = `§cFailed to load §e${targetName}§c's island data.`
                        if (origin instanceof Player) origin.error(message);
                        else Server.logger.log(message);
                        return;
                    }
                    const newName = name.result!;
                    validifyIslandName(newName, IslandDatabase.instance).then((validation) => {
                        if (!validation.success) {
                            if (origin instanceof Player) origin.error(validation.message!);
                            else Server.logger.log(validation.message!);
                            return;
                        }
                        island.setName(newName).then((result) => {
                            if (!result.success) {
                                if (origin instanceof Player) origin.error(result.reason!);
                                else Server.logger.log(result.reason!);
                                return;
                            }
                            const message = `§bSuccessfully renamed §6${targetName}§b's island to §e${newName}§b.`
                            if (origin instanceof Player) origin.info(message);
                            const isOnline = Server.instance.getPlayerByUsername(targetName);
                            if (isOnline) isOnline.info(`§cYour island has been force renamed to §e${newName} §cby staff.`);
                            else Island.unload(island.getName());
                        })
                    })
                })
            })
        } catch (e) {
            Island.logger.warn(
                "Error during island rename for " + targetName + ": " + e
            );
        }
    }))
    .register();