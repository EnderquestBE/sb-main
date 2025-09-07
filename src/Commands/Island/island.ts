import { Entity, LevelDBProvider, ModalForm, StringEnum, } from "@serenityjs/core";
import { Gamemode, Vector3f } from "@serenityjs/protocol";
import { CommandBuilder, CommandOverload, Island, IslandDatabase } from "../../Classes/classes";
import { validifyIslandName } from "../../Utils/utils";
import { Server } from "../../server";
import { IslandGenerator } from "./../../Classes/Island/generator";
import { rmdir } from "fs/promises";
import { resolve } from "path";

new CommandBuilder("iscreate", "Create an island.").addOverload(
  new CommandOverload({
    name: [StringEnum, true]
  }).onCallback((origin, { name }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return
    const player = origin
    try {
      player.getIsland().then(async (island) => {
        if (island) return player.error(`You already own the §e${island.getName()}§c island. Use §6/is go§c to teleport there.`)
        async function createIsland(name: string) {
          validifyIslandName(name, IslandDatabase.instance).then(async (result) => {
            if (!result.success) return player.error(result.message!)
            const worldKey = `sb_${name}`
            if (player.world.serenity.getWorld(worldKey)) return
            player.world.serenity.createWorld(LevelDBProvider, {
              identifier: worldKey,
              dimensions: [{
                identifier: "overworld",
                viewDistance: 8,
                simulationDistance: 4,
                generator: IslandGenerator.identifier
              }],
              gamemode: Gamemode.Survival,
              gamerules: {
                keepInventory: true
              }
            }).then(async (world) => {
              if (!world) {
                Server.logger.error("Failed to create world for " + player.username + " during island creation.")
                return
              }
              await Island.createDefault(name, player, worldKey)
              player.setIslandName(name)
              player.teleport(new Vector3f(0.5, 2, 0.5), world.getDimension())
              player.gamemode = Gamemode.Survival
              player.info(`§aYour island §e${name} §ahas been created! Use §6/is go §ato teleport there.`)
            })
          })
        }

        //@ts-ignore
        const nameValue = name.result
        if (nameValue) {
          createIsland(nameValue)
        }
        else {
          const form = new ModalForm("Create Island")
          form.input("Enter island name:")
          form.show(player).then(async (result) => {
            if (result instanceof Error) {
              return Server.logger.error(result)
            }
            if (typeof result[0] !== "string") return
            const name = result[0].replace(/\s/g, "");
            createIsland(name)
          })
        }
      })
    } catch (e) {
      Server.logger.warn("Error during island creation for " + player.username + ": " + e)
    }
  })
).register()


new CommandBuilder("isdelete", "Deletes an island.").addOverload(
  new CommandOverload({
  }).onCallback((origin) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return
    const player = origin
    try {
      player.getIsland().then(async (island) => {
        if (!island) return player.error(`You don't have an island! Use /is create <name> to create one.`)

        const serenity = player.world.serenity

        const lobby = serenity.getWorld("default")!
        const name = island.getName()
        player.teleport(new Vector3f(0.5, 0, 0.5), lobby.getDimension())

        serenity.worlds.delete(island.getWorld())
        rmdir(resolve(`./worlds/${island.getWorld()}`), { recursive: true })

        IslandDatabase.instance.delete(name)
        player.setIslandName("")

        player.info(`§cYour island §e${name} §chas been deleted.`)
      })
    } catch (e) {
      Server.logger.warn("Error during island deletion for " + player.username + ": " + e)
    }
  })
).register()