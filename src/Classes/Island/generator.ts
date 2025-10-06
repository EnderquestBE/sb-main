import { BinaryStream } from "@serenityjs/binarystream";
import { BlockChestTrait, BlockIdentifier, BlockPermutation, Chunk, ItemIdentifier, ItemStack, Structure, TerrainGenerator, VoidGenerator, World } from "@serenityjs/core";
import { CompoundTag } from "@serenityjs/nbt";
import { Vector3f } from "@serenityjs/protocol";
import { readFileSync } from "fs";

class IslandGenerator extends TerrainGenerator {
    static readonly identifier = "skyblock";

    private static islandStructure: Structure;

    public async apply(cx: number, cz: number): Promise<Chunk> {
        // Create a new chunk
        const chunk = new Chunk(cx, cz, this.dimension.type);

        // Return the generated chunk
        return chunk;
    }

    public async populate(chunk: Chunk): Promise<void> {
        const x = chunk.x
        const z = chunk.z

        // Create an island in the center chunk.
        //@ts-ignore
        if (x === 3 && z === 3 && this.dimension.world.properties["isInitialized"] !== true) {
            await this.dimension.placeStructure(
                IslandGenerator.islandStructure,
                { x: -5, y: 0, z: -1 },
                { placeAirBlocks: false }
            );
            this.starterChest()
            //@ts-ignore
            this.dimension.world.properties["isInitialized"] = true
        }
    }

    public async starterChest() {
        const chestBlock = this.dimension.getBlock(new Vector3f(-2, 3, 3))
        chestBlock.setPermutation(BlockPermutation.resolve(BlockIdentifier.Chest))
        chestBlock.setState("minecraft:cardinal_direction", "east")
        const inv = (chestBlock.getTrait(BlockChestTrait) ?? chestBlock.addTrait(BlockChestTrait)).container
        inv.addItem(new ItemStack("minecraft:water", { stackSize: 1 }))
        inv.addItem(new ItemStack("minecraft:lava", { stackSize: 1 }))
        inv.addItem(new ItemStack(ItemIdentifier.BeetrootSeeds, { stackSize: 2 }))
        inv.addItem(new ItemStack(ItemIdentifier.WheatSeeds, { stackSize: 5 }))
        inv.addItem(new ItemStack(ItemIdentifier.PumpkinSeeds, { stackSize: 1 }))
        inv.addItem(new ItemStack(ItemIdentifier.Carrot, { stackSize: 1 }))
        inv.addItem(new ItemStack(ItemIdentifier.Potato, { stackSize: 1 }))
        inv.addItem(new ItemStack(ItemIdentifier.Cactus, { stackSize: 1 }))
        inv.addItem(new ItemStack(ItemIdentifier.MelonBlock, { stackSize: 1 }))
        inv.addItem(new ItemStack(ItemIdentifier.Apple, { stackSize: 8 }))
        inv.addItem(new ItemStack(ItemIdentifier.Bone, { stackSize: 1 }))

        chestBlock.update()
    }

    public static registerStructure(world: World) {
        const buffer = readFileSync("./structures/skyblock/island_classic.mcstructure")
        const stream = new BinaryStream(buffer)
        const compound = CompoundTag.read(stream)
        IslandGenerator.islandStructure = Structure.from(world, compound)
    }
}

export { IslandGenerator }