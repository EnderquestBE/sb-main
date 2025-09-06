import { Entity, LevelDBProvider, ModalForm, StringEnum, VoidGenerator } from "@serenityjs/core";
import { CommandBuilder, CommandOverload, Island, IslandDatabase } from "../Classes/classes";
import { validifyIslandName } from "../Utils/utils";
import { Gamemode, Vector3f } from "@serenityjs/protocol";
import { Server } from "../server";

new CommandBuilder("iscreate", "Create an island.").addOverload(
  new CommandOverload({
    name: [StringEnum, true]
  }).onCallback((origin, { name }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return
    const player = origin
    try {
      player.getIsland().then((island) => {
        if (island) return player.error(`You already own the §e${island.getName()}§c island.\nUse §6/is go§c to teleport there.`)

        async function createIsland(name: string) {
          validifyIslandName(name, IslandDatabase.instance).then((result) => {
            if (!result.success) return player.error(result.message!)
          })
          const worldKey = `sb_${name}`
          const world = await player.world.serenity.createWorld(LevelDBProvider, {
            identifier: worldKey,
            dimensions: [{
              identifier: "overworld",
              generator: VoidGenerator.identifier
            }]
          })
          if (!world) {
            Server.logger.error("Failed to create world for " + player.username + " during island creation.")
            return
          }
          Island.createDefault(name, player, worldKey)
          player.teleport(new Vector3f(0, 0, 0), world.getDimension())
          // Code to generate the actual island structure goes here.
          player.gamemode = Gamemode.Survival
          player.info(`§aYour island §e${name} §ahas been created! Use §6/is go §ato teleport there.`)
        }

        const nameValue = (name[0] as StringEnum | undefined)?.result
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
    name: [StringEnum, true]
  }).onCallback((origin, { name }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return
    const player = origin
    try {
      player.getIsland().then((island) => {
        if (island) return player.error(`You already own the §e${island.getName()}§c island.\nUse §6/is go§c to teleport there.`)

        async function createIsland(name: string) {
          validifyIslandName(name, IslandDatabase.instance).then((result) => {
            if (!result.success) return player.error(result.message!)
          })
          const worldKey = `sb_${name}`
          const world = await player.world.serenity.createWorld(LevelDBProvider, {
            identifier: worldKey,
            dimensions: [{
              identifier: "overworld",
              generator: VoidGenerator.identifier
            }]
          })
          if (!world) {
            Server.logger.error("Failed to create world for " + player.username + " during island creation.")
            return
          }
          Island.createDefault(name, player, worldKey)
          player.teleport(new Vector3f(0, 0, 0), world.getDimension())
          // Code to generate the actual island structure goes here.
          player.gamemode = Gamemode.Survival
          player.info(`§aYour island §e${name} §ahas been created! Use §6/is go §ato teleport there.`)
        }

        const nameValue = (name[0] as StringEnum | undefined)?.result
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