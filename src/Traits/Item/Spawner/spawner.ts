import {
    ItemStack,
    ItemIdentifier,
    ItemStackTrait,
    BlockIdentifier,
    Player,
    ItemStackUseOnBlockOptions,
    BlockPermutation,
    EntityIdentifier,
} from "@serenityjs/core";
import { FloatTag, ShortTag, StringTag } from "@serenityjs/nbt";
import { SpawnerHandler } from "../../../Handlers/Spawner/spawner";
import { BlockSpawnerTrait } from "../../Block/traits";
import { ServerTaskHandler } from "../../../Handlers/Server/handler";

class ItemSpawnerTrait extends ItemStackTrait {
    public static readonly identifier = "spawner";

    public static readonly types = [
        ItemIdentifier.MobSpawner
    ];

    public constructor(item: ItemStack) {
        super(item);
    }

    public onUseOnBlock(_player: Player, { targetBlock: block, face }: ItemStackUseOnBlockOptions): void {
        ServerTaskHandler.queueTask(() => {
            block = block.face(face)
            if (block.type.identifier !== BlockIdentifier.MobSpawner) return
            const trait = block.getTrait(BlockSpawnerTrait) ?? block.addTrait(BlockSpawnerTrait)

            // Set NBT for spawner based on the item data.
            const entityId = this.item.nbt.get<StringTag>("EntityIdentifier")?.valueOf() as string
            const level = this.item.nbt.get<ShortTag>("Level")?.valueOf() as number

            if (!entityId || !level) {
                return
            }

            block.setPermutation(BlockPermutation.resolve(BlockIdentifier.MobSpawner))

            block.addStorageEntry(new ShortTag(656, "Delay"))

            block.addStorageEntry(new FloatTag(1.8, "DisplayEntityHeight")) // 1.8
            block.addStorageEntry(new FloatTag(1, "DisplayEntityScale")) // 1
            block.addStorageEntry(new FloatTag(0.8, "DisplayEntityWidth")) // 0.8
            block.addStorageEntry(new StringTag(entityId, "EntityIdentifier"))

            block.setStorageEntry("SpawnDelay", new ShortTag(SpawnerHandler.SPEEDS[level - 1]!, "SpawnDelay")) // Amount of time between spawns in seconds.
            block.setStorageEntry("Level", new ShortTag(level, "Level")) // Spawner level.
            block.sendStorageUpdate()

            // Update trait data.
            trait.updateStats(entityId as EntityIdentifier, level, SpawnerHandler.SPEEDS[level - 1]!)
        }, 5);
    }
}

export { ItemSpawnerTrait };