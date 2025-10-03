import { CustomEnum, Entity } from "@serenityjs/core"
import { CommandOverload, Island, IslandDatabase, Warp } from "../../Classes"
import { resolve } from "path"
import { rmdir } from "fs/promises"

const DeleteCooldownMap = new Map<string, number>()

class IslandDeleteEnum extends CustomEnum {
    public static readonly identifier = "islandDelete"
    public static options = ["delete", "disband"]
}

class IslandConfirmEnum extends CustomEnum {
    public static readonly identifier = "islandConfirm"
    public static options = ["confirm"]
}

const IslandDeleteCommand = new CommandOverload(
    {
        delete: IslandDeleteEnum,
        confirm: [IslandConfirmEnum, true]
    }
).onCallback((origin, { confirm }) => {
    if (!(origin instanceof Entity) || !origin.isPlayer()) return
    const player = origin
    try {
        player.getIslandAsync().then(async (island) => {
            if (!island) return player.error(`You don't have an island! Use /is create <name> to create one.`)

            if (island.getLevel() < 5) {
                return player.error("Your island must be at least level §65 §cto delete it.")
            }

            //@ts-ignore
            if (!confirm.result) {
                return player.error("Are you sure you want to permanently delete your island? §6To confirm, use §e/is delete §dconfirm§6.")
            }

            const lastDelete = DeleteCooldownMap.get(player.xuid)
            if (lastDelete && Date.now() - lastDelete < 1800000) {
                const remaining = Math.ceil(((lastDelete - Date.now())) / 60000)
                return player.error(`You must wait §7${remaining} §cminutes to delete your island again.`)
            }

            if (island.getOwner().xuid !== player.xuid) {
                return player.error("Only the island owner can delete the island.")
            }

            const world = player.world
            const serenity = world.serenity

            const players = world.getPlayers()
            for (const p of players) {
                Warp.to(p, "SPAWN");
                p.info(`§cYou have been kicked from §e${island.getName()}§c: Island has been deleted.`);
            }
            const name = island.getName()

            serenity.worlds.delete(island.getWorldId())
            rmdir(resolve(`./worlds/${island.getWorldId()}`), { recursive: true })

            IslandDatabase.instance.delete(name)
            Island.unload(name)
            player.setIslandName("")
            DeleteCooldownMap.set(player.xuid, Date.now() + 1800000)

            player.info(`§cYour island §e${name} §chas been deleted.`)
        })
    } catch (e) {
        Island.logger.warn("Error during island deletion for " + player.username + ": " + e)
    }
})

export { IslandDeleteCommand }