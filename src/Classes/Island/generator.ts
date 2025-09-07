import { BinaryStream } from "@serenityjs/binarystream";
import { Chunk, Structure, TerrainGenerator, World } from "@serenityjs/core";
import { CompoundTag } from "@serenityjs/nbt";
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
        if (x === 3 && z === 3)
            await this.dimension.placeStructure(
                IslandGenerator.islandStructure,
                { x: -5, y: -2, z: -1 },
                { placeAirBlocks: false }
            );
    }

    public static registerStructure(world: World) {
        const buffer = readFileSync("./structures/skyblock/island_classic.mcstructure")
        const stream = new BinaryStream(buffer)
        const compound = CompoundTag.read(stream)
        IslandGenerator.islandStructure = Structure.from(world, compound)
    }
}

export { IslandGenerator }