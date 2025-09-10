import { CustomEnum, Entity } from "@serenityjs/core"
import { CommandOverload, Island, IslandDatabase } from "../../Classes/classes"
import { resolve } from "path"
import { rmdir } from "fs/promises"
import { Warp } from "../../Classes/Warp/warp"

class IslandDeleteEnum extends CustomEnum {
    public static readonly identifier = "islandDelete"
    public static options = ["delete"]
}


const IslandDeleteCommand = new CommandOverload(
    {
        delete: IslandDeleteEnum
    }
).onCallback((origin) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return
    const player = origin
    try {
        player.getIslandAsync().then(async (island) => {
            if (!island) return player.error(`You don't have an island! Use /is create <name> to create one.`)

            const serenity = player.world.serenity

            Warp.to(player, "SPAWN")
            const name = island.getName()

            serenity.worlds.delete(island.getWorldId())
            rmdir(resolve(`./worlds/${island.getWorldId()}`), { recursive: true })

            IslandDatabase.instance.delete(name)
            Island.unload(name)
            player.setIslandName("")

            player.info(`§cYour island §e${name} §chas been deleted.`)
        })
    } catch (e) {
        Island.logger.warn("Error during island deletion for " + player.username + ": " + e)
    }
})

export { IslandDeleteCommand }