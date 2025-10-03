import { CustomEnum, Entity, LevelDBProvider, ModalForm, StringEnum } from "@serenityjs/core"
import { CommandOverload, Island, IslandDatabase, IslandGenerator } from "../../Classes"
import { validifyIslandName } from "../../Utils"
import { Gamemode } from "@serenityjs/protocol"

class IslandCreateEnum extends CustomEnum {
    public static readonly identifier = "islandCreate"
    public static options = ["create"]
}

const IslandCreateCommand = new CommandOverload(
    {
        create: IslandCreateEnum,
        name: [StringEnum, true]
    }
).onCallback((origin, { name }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return
    const player = origin
    try {
        player.getIslandAsync().then(async (island) => {
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
                            doEntityDrops: false,
                            doFireTick: false,
                            doLimitedCrafting: true,
                            doTileDrops: false,
                            fallDamage: false,
                            fireDamage: false,
                            keepInventory: true,
                            pvp: false,
                            showCoordinates: false
                        }
                    }).then(async (world) => {
                        if (!world) {
                            Island.logger.error("Failed to create world for " + player.username + " during island creation.")
                            return
                        }
                        await Island.createDefault(name, player, worldKey)
                        player.setIslandName(name)
                        player.info(`§aYour island §e${name} §ahas been created! Use §6/is §5go §ato teleport there.`)
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
                        return Island.logger.error(result)
                    }
                    if (typeof result[0] !== "string") return
                    const name = result[0].replace(/\s/g, "");
                    createIsland(name)
                })
            }
        })
    } catch (e) {
        Island.logger.warn("Error during island creation for " + player.username + ": " + e)
    }
})

export { IslandCreateCommand }