import { LevelDBProvider, Serenity, Structure, World, WorldInitializeSignal, WorldProperties, WorldProviderProperties } from "@serenityjs/core";
import { BinaryStream } from "@serenityjs/binarystream";
import { CompoundTag } from "@serenityjs/nbt";
import { resolve } from "node:path";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";

class IslandDBProvider extends LevelDBProvider {
    public static readonly identifier: string = "islandb";

    public static async initialize(
        _serenity: Serenity,
        _properties: WorldProviderProperties
    ): Promise<void> {
        // Resolve the path for the islands directory.
        const path = resolve("./islands");

        // Check if the path provided exists.
        // If it does not exist, create the directory.
        if (!existsSync(path)) mkdirSync(path);
    }

    public static async loadWorld(serenity: Serenity, worldId: string) {
        // Resolve the path for the islands directory.
        const path = resolve("./islands");

        // Check if the path provided exists.
        // If it does not exist, create the directory.
        if (!existsSync(path)) mkdirSync(path);

        // Get the path for the world.
        const worldPath = resolve(path, worldId);

        // Get the world properties.
        let properties: Partial<WorldProperties> = { identifier: worldId };
        if (existsSync(resolve(worldPath, "properties.json"))) {
            // Read the properties of the world.
            properties = JSON.parse(
                readFileSync(resolve(worldPath, "properties.json"), "utf-8")
            );
        }

        // Check if the world directory contains a structures directory.
        if (!existsSync(resolve(worldPath, "structures")))
            // Create the structures directory if it does not exist.
            mkdirSync(resolve(worldPath, "structures"));

        // Create a new world instance.
        const world = new World(serenity, new this(worldPath), properties);

        // Create a new WorldInitializedSignal instance.
        new WorldInitializeSignal(world).emit();

        // Write the properties to the world.
        writeFileSync(
            resolve(worldPath, "properties.json"),
            JSON.stringify(world.properties, null, 2)
        );

        // Read all the structures in the world directory.
        const files = readdirSync(resolve(worldPath, "structures"), {
            withFileTypes: true
        }).filter(
            // Filter only files that end with .mcstructure.
            (dirent) => dirent.isFile() && dirent.name.endsWith(".mcstructure")
        );

        // Attempt to read the structures from the world directory.
        for (const file of files) {
            try {
                // Create the structure from the file.
                const path = resolve(worldPath, "structures", file.name);

                // Read the structure file.
                const stream = new BinaryStream(readFileSync(path));

                // Create a new structure instance from the file.
                const structure = Structure.from(world, CompoundTag.read(stream));

                // Parse the identifier from the file name.
                const identifier = file.name.replace(/\.mcstructure$/, "");

                // Add the structure to the world.
                world.structures.set(identifier, structure);

                // Log a debug message indicating the structure was loaded.
                world.logger.debug(
                    `Loaded structure "${identifier}" from file "${file.name}" for world "${world.properties.identifier}."`
                );
            } catch (reason) {
                // Log the error if the structure failed to load.
                world.logger.error(
                    `Failed to load structure from file ${file.name} for world ${world.properties.identifier}. Reason:`,
                    reason
                );
            }
        }

        // Register world to serenity instance.
        serenity.registerWorld(world)
    }

    public static async create(
        serenity: Serenity,
        _properties: WorldProviderProperties,
        worldProperties?: Partial<WorldProperties>
    ): Promise<World> {
        // Resolve the path for the worlds directory.
        const path = resolve("./islands");

        // Check if the path provided exists.
        // If it does not exist, create the directory.
        if (!existsSync(path)) mkdirSync(path);

        // Check if a world identifier was provided.
        if (!worldProperties?.identifier)
            throw new Error("A world identifier is required to create a new world.");

        // Get the world path from the properties.
        const worldPath = resolve(path, worldProperties.identifier);

        // Check if the world already exists.
        if (existsSync(worldPath))
            throw new Error(
                `World with identifier ${worldProperties.identifier} already exists in the directory.`
            );

        // Create the world directory.
        mkdirSync(worldPath);

        // Create a new world instance.
        const world = new World(serenity, new this(worldPath), worldProperties);

        // Assign the world to the provider.
        world.provider.world = world;

        // Create a new WorldInitializedSignal instance.
        new WorldInitializeSignal(world).emit();

        // Create the properties file for the world.
        writeFileSync(
            resolve(worldPath, "properties.json"),
            JSON.stringify(world.properties, null, 2)
        );

        // Return the created world.
        return world;
    }
}

export { IslandDBProvider };