import {
    Block,
    BlockIdentifier,
    BlockInteractionOptions,
    BlockDestroyOptions,
    BlockTrait,
    TraitOnTickDetails,
    EntityIdentifier,
    MessageForm,
    BlockPlacementOptions,
} from "@serenityjs/core";
import { Island } from "../../../Classes";
import { Vector3f } from "@serenityjs/protocol";
import { Utils } from "../../../Utils/utils";
import { ShortTag } from "@serenityjs/nbt";
import { SpawnerColorMap, SpawnerHandler } from "../../../Handlers/Spawner/spawner";

class BlockSpawnerTrait extends BlockTrait {
    public static readonly identifier: string = "minecraft:spawner";
    public static readonly types: Array<BlockIdentifier> = [
        BlockIdentifier.MobSpawner
    ];

    private islandName: string;

    private ENTITY!: EntityIdentifier;
    private SPEED!: number;
    private LEVEL!: number;

    private speedInTicks: number = 0

    public constructor(block: Block) {
        super(block);
        this.islandName = this.dimension.world.identifier.slice(3);

        const entityId = block.getStorageEntry("EntityIdentifier")?.valueOf() as string
        const level = block.getStorageEntry("Level")?.valueOf() as number
        const speed = block.getStorageEntry("SpawnDelay")?.valueOf() as number
        if (entityId && level && speed) this.updateStats(entityId as EntityIdentifier, level, speed)
    }

    public onInteract({ origin }: BlockInteractionOptions): void {

        const player = origin!

        const price = SpawnerHandler.PRICES[this.LEVEL - 1]!
        const isMaxed = this.LEVEL >= SpawnerHandler.MAX_LEVEL
        const form = new MessageForm("Spawner Info")
        form.content = `§7Upgrading your spawner increases spawning speed.\n§dSpawner Type: ${SpawnerColorMap[this.ENTITY as keyof typeof SpawnerColorMap]}${Utils.formatString(this.ENTITY)}\n§6Spawner Level: §f${Utils.toRomanNumeral(this.LEVEL)}${isMaxed ? "" : ` §7-> §e${Utils.toRomanNumeral(this.LEVEL + 1)}`}\n§bSpawner Speed: §f${this.SPEED}.0s${isMaxed ? "" : ` §7-> §e${SpawnerHandler.SPEEDS[this.LEVEL]}.0s`}\n\n§eUpgrade Cost: ${isMaxed ? "§cMAX" : `${price > player.getMoney() ? "§c" : "§a"}$${Utils.formatInt(price)}§e`}`
        form.button1 = "Upgrade"
        form.button2 = "Close"

        if (player.pendingForms.size > 0) return;

        form.show(player, (result, error) => {
            if (error || !result) return
            if (this.LEVEL >= SpawnerHandler.MAX_LEVEL) {
                player.error("Spawner is already at max level.")
                return
            }
            // Check if the player can afford the upgrade.
            if (price > player.getMoney()) {
                player.error("You cannot afford to upgrade this.")
                return
            }
            player.removeMoney(price)
            this.LEVEL += 1
            this.SPEED = SpawnerHandler.SPEEDS[this.LEVEL - 1]!
            this.updateStats(this.ENTITY, this.LEVEL, this.SPEED)
            this.updateStorage()
            player.info(`§6Upgraded §l${SpawnerColorMap[this.ENTITY as keyof typeof SpawnerColorMap] ?? "§5"}${Utils.formatString(this.ENTITY)} §dSpawner §r§6to level §e${Utils.toRomanNumeral(this.LEVEL)}§6.`)
            player.playSound("mob.zombie.woodbreak", { position: this.block.position, volume: 0.5, pitch: 0.75 })
        })
    }

    public onTick(details: TraitOnTickDetails): void {
        if (Number(details.currentTick) % this.speedInTicks !== 0) return
        // Get nearest matching spawner entity.
        const { x, y, z } = this.block.position
        const entities = this.dimension.getEntities().filter(x => x.identifier === this.ENTITY)

        // Spawn a new entity if it doesn't exist.
        if (entities.length === 0) {
            // Spawn entity at a random position 2-4 blocks from the spawner.
            const angle = Math.random() * Math.PI * 2
            const distance = Math.random() * 2 + 2
            const spawnPos = new Vector3f(
                x + Math.cos(angle) * distance,
                y + 0.5,
                z + Math.sin(angle) * distance
            )
            const entity = this.dimension.spawnEntity(this.ENTITY, spawnPos, false)
            entity.applyImpulse(new Vector3f(0.1, 0, 0.1))
            entity.setStorageEntry("MobStack", new ShortTag(1, "MobStack"))
            entity.setNametag(`§l§e${Utils.formatString(this.ENTITY)} §7x§c1`)
            entity.setNametagAlwaysVisible(true)
            entity.spawn();
        }
        // Increment existing entity.
        else {
            const entity = entities[0]!
            const mobStack = entity.getStorageEntry<ShortTag>("MobStack")?.valueOf()
            if (!mobStack) {
                entity.kill()
                return
            }
            entity.setStorageEntry("MobStack", new ShortTag(mobStack + 1, "MobStack"))
            entity.setNametag(`§l§e${Utils.formatString(this.ENTITY)} §7x§c${mobStack + 1}`)
            entity.setNametagAlwaysVisible(true)
        }
    }

    public onPlace({ origin: player }: BlockPlacementOptions): boolean | void {
        if (!player || !player.isPlayer()) return false
        // Get data for the island the spawner is on.
        const island = player.getWorldIsland()

        if (!island) {
            player.error("This item must be placed on an island.")
            return false
        }

        // Check if the spawner limit has been reached.
        if (island.isLimitReached("spawners")) {
            player.error(`Island has reached the spawner limit.\n§dUse §e/is expand §dto increase it.`)
            return false
        }

        // Increment island limit.
        if (island) island.incrementLimit("spawners", 1)
        return true
    }

    public onBreak({ origin: player }: BlockDestroyOptions): void {
        if (!player || !player.isPlayer()) return

        const item = SpawnerHandler.createItem(this.ENTITY, this.LEVEL)

        player.inventory.addItem(item)

        // Get data for the island the spawner is on.
        const island = Island.loadSync(this.islandName)

        // Decrement island limit.
        if (island) island.decrementLimit("spawners", 1)
    }

    public updateStats(entityId: EntityIdentifier, level: number, speed: number): void {
        this.ENTITY = entityId
        this.LEVEL = level
        this.SPEED = speed
        this.speedInTicks = speed * 20
    }

    public updateStorage(): void {
        this.block.setStorageEntry("SpawnDelay", new ShortTag(this.SPEED, "SpawnDelay"))
        this.block.setStorageEntry("Level", new ShortTag(this.LEVEL, "Level"))
        this.block.sendStorageUpdate()
    }
}

export { BlockSpawnerTrait };