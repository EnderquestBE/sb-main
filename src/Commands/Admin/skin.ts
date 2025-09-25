import { Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload, PlayerEnum } from "../../Classes";
import { Server } from "../../server";
import sharp from "sharp";
import { resolve } from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";

new CommandBuilder("skin", "Saves a player's skin to file.")
    .setPermissions(["serenity.operator"])
    .addOverload(
        new CommandOverload({
            player: PlayerEnum
        }).onCallback((origin, { player }) => {
            if (!(origin instanceof Player)) return;
            const targetName = player.result as string
            if (!targetName) return
            const target = Server.instance.getPlayerByUsername(targetName)
            if (!target) {
                origin.error("Player is offline or does not exist.")
                return
            }

            const dir = resolve("./output/skins/" + target.username + "-" + new Date().toISOString().replace(/:/g, "-"))
            mkdirSync(resolve("./output/skins/"), { recursive: true })

            // Write skin.
            sharp(target.skin.skinImage.data, {
                raw: {
                    width: target.skin.skinImage.width,
                    height: target.skin.skinImage.height,
                    channels: 4,
                },
            }).toFile(dir + ".png").then(() => {
                origin.info("§aSaved §e" + target.username + "§a's skin to file.");
            })
            // Write geometry.
            writeFileSync(resolve(dir + ".json"), target.skin.geometryData)
        }))
    .register("Admin");