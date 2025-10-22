import { v4 as uuid } from 'uuid';
import * as Jimp from 'jimp';
import { Player } from "@serenityjs/core";
import { GeometryDefinition, MinecraftGeometryFile, VanityInfo } from "../../Types/types";
import { PlayerSkinPacket, SerializedSkin, SkinAnimation, SkinImage } from '@serenityjs/protocol';
import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';

async function augmentSkinAndUV(
    skinImage: Jimp.Bitmap,
    vanityItems: (VanityInfo | null)[],
): Promise<Buffer> {
    const vanityTextures = vanityItems.filter((x) => x !== null).map(v => v.texture);
    // Create new image 128x128.
    const canvas = new Jimp.Jimp({ width: 128, height: 128, data: Buffer.alloc(128 * 128 * 4, 0) });
    const jimpSkin = new Jimp.Jimp(skinImage);

    // Place base skin in top left most corner.
    canvas.composite(jimpSkin, 0, 0);

    // Define corner placements for vanity textures.
    const placements = [
        { x: 64, y: 0 }, // Top-right
        { x: 0, y: 64 }, // Bottom-left
        { x: 64, y: 64 }, // Bottom-right
    ];

    // Append vanity textures to the skin.
    for (let i = 0; i < vanityTextures.length; i++) {
        // Maximum of 3 slots.
        if (i >= placements.length) {
            console.warn(`Provided more than 3 vanity textures. Ignoring extra textures.`);
            break;
        }

        try {
            const vanityBase64 = vanityTextures[i];
            if (!vanityBase64) continue;
            const vanityBuffer = Buffer.from(vanityBase64, 'base64');
            const vanityImage = await Jimp.Jimp.read(vanityBuffer);

            const { x, y } = placements[i]!;
            canvas.composite(vanityImage, x, y);
        } catch (error) {
            console.error(`Failed to process vanity texture at index ${i}:`, error);
        }
    }

    // 5. Return raw RGBA buffer of new skin texture.
    return canvas.bitmap.data;
}

function augmentGeometry(
    basePlayerGeometry: GeometryDefinition,
    formatVersion: string,
    geometryKey: string,
    textureFormat: "modern" | "legacy",
    vanityItems: (VanityInfo | null)[]
): MinecraftGeometryFile {
    // Copy player's base geometry.
    const finalGeometry = JSON.parse(JSON.stringify(basePlayerGeometry));

    // Fix legacy format if necessary.
    if (textureFormat === "legacy") {
        // Handle simple UV.
        const leftArm = finalGeometry.bones.find((b: any) => b.name === "leftArm");
        leftArm.cubes = [
            {
                "origin": [4, 12, -2],
                "size": [4, 12, 4],
                "uv": {
                    "north": { "uv": [48, 20], "uv_size": [-4, 12] },
                    "east": { "uv": [52, 20], "uv_size": [-4, 12] },
                    "south": { "uv": [56, 20], "uv_size": [-4, 12] },
                    "west": { "uv": [44, 20], "uv_size": [-4, 12] },
                    "up": { "uv": [44, 16], "uv_size": [4, 4] },
                    "down": { "uv": [48, 20], "uv_size": [4, -4] }
                }
            }
        ];
        const leftLeg = finalGeometry.bones.find((b: any) => b.name === "leftLeg");
        leftLeg.cubes = [
            {
                "origin": [-0.1, 0, -2],
                "size": [4, 12, 4],
                "uv": {
                    "north": { "uv": [8, 20], "uv_size": [-4, 12] },
                    "east": { "uv": [8, 20], "uv_size": [4, 12] },
                    "south": { "uv": [16, 20], "uv_size": [-4, 12] },
                    "west": { "uv": [4, 20], "uv_size": [-4, 12] },
                    "up": { "uv": [4, 16], "uv_size": [4, 4] },
                    "down": { "uv": [8, 20], "uv_size": [4, -4] }
                }
            }
        ];
    }

    // Get geometry details.
    let textureWidth, textureHeight: number;
    switch (formatVersion) {
        case "1.8.0":
            textureWidth = finalGeometry.textureheight;
            textureHeight = finalGeometry.texturewidth;
            break;
        default:
            textureWidth = finalGeometry.description.texture_width;
            textureHeight = finalGeometry.description.texture_height;
            break;
    }

    // Set texture size to 128x128.
    if (textureWidth !== 128 || textureHeight !== 128) {
        switch (formatVersion) {
            case "1.8.0":
                finalGeometry.texturewidth = 128;
                finalGeometry.textureheight = 128;
                break;
            default:
                finalGeometry.description.texture_width = 128;
                finalGeometry.description.texture_height = 128;
                break;
        }
    }

    const validVanityItems = vanityItems.filter((v): v is VanityInfo => v !== null);

    // Iterate through vanity items.
    for (const [vanityIndex, vanity] of validVanityItems.entries()) {
        const vanityGeometryData = JSON.parse(JSON.stringify(vanity.geometry));

        // Check for geometry.
        if (!vanityGeometryData) {
            console.error("Failed to parse vanity geometry for item:", vanity.id);
            continue;
        }

        // Get primary geometry definition.
        const vanityGeoDef = vanityGeometryData['minecraft:geometry']?.[0];
        if (!vanityGeoDef) {
            console.error("Failed to find vanity geometry definition for item:", vanity.id);
            continue;
        }

        if (vanityIndex < 0 || vanityIndex > 2) {
            throw new Error(`Invalid vanityIndex: ${vanityIndex}. Must be 0, 1, or 2.`);
        }

        // Offset UV coordinates for each bone.
        for (const bone of vanityGeoDef.bones) {
            // Check for suffix flag "-i" to ignore UV adjustment.
            if (bone.name.endsWith("-i") || bone.parent?.endsWith("-i")) continue;
            // Handle polymeshes UV.
            if (bone.poly_mesh) {
                const offsets = [
                    { x: 0.5, y: 0.5 },
                    { x: 0, y: -0.5 },
                    { x: 0.5, y: -0.5 },
                ];
                const round5 = (n: number) => Math.round(n * 1e5) / 1e5;

                const { x: offsetX, y: offsetY } = offsets[vanityIndex]!;
                bone.poly_mesh.uvs = bone.poly_mesh.uvs.map((uv: [number, number]) => {
                    const newU = (uv[0] * 0.5) + offsetX;
                    const newV = (uv[1] * 0.5) + offsetY;;
                    return [round5(newU), round5(newV)];
                });
            } else if (bone.cubes) {
                // Handle simple UV.
                const offsets = [
                    { x: 64, y: 0 },
                    { x: 0, y: 64 },
                    { x: 64, y: 64 },
                ];

                const { x: offsetX, y: offsetY } = offsets[vanityIndex]!;
                bone.cubes.forEach((cube: any) => {
                    if (Array.isArray(cube.uv)) {
                        cube.uv[0] += offsetX;
                        cube.uv[1] += offsetY;
                    } else {
                        // Handle per-face UV.
                        for (const face of Object.values(cube.uv as object)) {
                            if (face && face.uv) {
                                face.uv[0] += offsetX;
                                face.uv[1] += offsetY;
                            }
                        }
                    }
                });
            }
        }

        // 5. Verify target parent bone is present.
        const parentBoneExists = finalGeometry.bones.some((bone: any) => bone.name === vanity.bone);
        if (!parentBoneExists) {
            throw new Error(
                `Parent bone "${vanity.bone}" not found in base geometry "${finalGeometry.description.identifier}".`
            );
        }

        // Merge vanity bones into new geometry.
        vanityGeoDef.bones.forEach((vanityBone: any) => {
            const newBone = { ...vanityBone };

            // Handle bone name conflicts.
            const existingBone = finalGeometry.bones.find((b: any) => b.name === newBone.name.replace(/[-][a-z]$/, ""));
            let skipBone = false;
            if (existingBone) {
                // Check for suffix flag '-r', that means this bone should replace the existing bone on the model.
                if (newBone.name.endsWith("-r")) {
                    finalGeometry.bones = finalGeometry.bones.filter((b: any) => b.name !== existingBone.name);
                    newBone.parent = existingBone.parent;
                    newBone.name = existingBone.name;
                }
                // Check for suffix flag '-a', that means this bone should be attached to the existing bone on the model.
                else if (newBone.name.endsWith("-a")) {
                    newBone.parent = existingBone.name;
                    newBone.name = `${newBone.name}-va${vanityIndex + 1}`;
                }
                // Check for suffix flag '-d', that means this bone should be deconstructed and have its cubes added to the existing bone.
                else if (newBone.name.endsWith("-d")) {
                    if (newBone.cubes) {
                        if (!existingBone.cubes) {
                            existingBone.cubes = [];
                        }
                        existingBone.cubes.push(...newBone.cubes);
                    }
                    skipBone = true;
                }
                else {
                    newBone.name = `${newBone.name}-v${vanityIndex + 1}`;
                }
            }

            // Only set the parent for the root bones of the vanity.
            else if (!newBone.parent) {
                newBone.parent = vanity.bone;
            }

            if (!skipBone) {
                finalGeometry.bones.push(newBone);
            }
        });
    }

    // 7. Return final geometry.
    switch (formatVersion) {
        case "1.8.0":
            return {
                format_version: "1.12.0",
                "minecraft:geometry": [{
                    description: {
                        identifier: geometryKey,
                        texture_width: 128,
                        texture_height: 128
                    },
                    ...finalGeometry
                }],
            } as MinecraftGeometryFile;
        default:
            return {
                format_version: "1.12.0",
                "minecraft:geometry": [finalGeometry]
            } as MinecraftGeometryFile;
    }
}

class VanitySkin {

    public static async create(player: Player) {
        // Check if player is using a persona skin.
        const serializedSkin = player.skin.getSerialized();
        const oldIdentifier = serializedSkin.identifier;
        if (serializedSkin.isPersona && !serializedSkin.identifier.endsWith(".vanity")) {
            VanitySkin.steve(player);
            player.error("Persona skins are not supported on this server, your skin has been reset to default.");
            return;
        }
        const textureFormat = serializedSkin.skinImage.height === 64 ? "modern" : "legacy";
        if (serializedSkin.skinImage.width > 64 || serializedSkin.skinImage.height > 64) {
            player.error("HD skins are not supported on this server, your skin has been reset to default.");
            VanitySkin.steve(player);
            return;
        }
        // Get current skin information.
        const identifier = uuid() + "." + "vanity";
        const skin = await player.skin.getSkinImage();
        const geometry = JSON.parse(serializedSkin.geometryData);
        const geometryKey = JSON.parse(serializedSkin.resourcePatch).geometry.default;
        // Get player vanity info.
        const vanityItems = player.getEquippedVanity();
        // Create vanity augmented skin texture.
        const newSkinImage = await augmentSkinAndUV(skin, vanityItems);
        // Write the new skin image to file for testing purposes.
        /*
        try {
            const img = await new Jimp.Jimp({ width: 128, height: 128, data: newSkinImage });
            await img.write(resolve(`./${player.username}_${identifier}.png`) as `${string}.${string}`);
        } catch (error) {
            console.error('Failed to write vanity skin image:', error);
        }
        */
        // Create vanity augmented geometry.
        const formatVersion = geometry.format_version;
        if (!formatVersion) {
            console.error("Failed to determine geometry format version for player:", player.username);
            return;
        }
        const geo = formatVersion === "1.8.0" ? geometry[geometryKey] : geometry["minecraft:geometry"].find((x: GeometryDefinition) => x.description.identifier === geometryKey);
        if (!geo) {
            console.error("Failed to find player geometry definition for player:", player.username);
            return;
        }
        const newGeometry = augmentGeometry(geo, formatVersion, geometryKey, textureFormat, vanityItems);
        // Construct new serialized skin.
        const newSkin = new SerializedSkin(identifier, serializedSkin.playFabIdentifier, serializedSkin.resourcePatch, { width: 128, height: 128, data: newSkinImage }, [], serializedSkin.capeImage ?? new SkinImage(0, 0, Buffer.from([])), JSON.stringify(newGeometry), geometry.format_version, "", serializedSkin.capeIdentifier, identifier, serializedSkin.armSize, "#0", [], [], true, true, false, true, true);

        // Send skin update packet.
        const packet = new PlayerSkinPacket();
        packet.uuid = player.uuid;
        packet.skin = newSkin;
        packet.skinName = identifier;
        packet.oldSkinName = oldIdentifier;
        packet.isVerified = true;

        player.world.broadcast(packet)
    }

    public static async steve(player: Player) {
        // Get current skin information.
        const serializedSkin = player.skin.getSerialized();
        const oldIdentifier = serializedSkin.identifier;
        // Create steve skin.
        const skinPath = resolve("./skins/textures/" + "steven.png");
        const skinTexture = await readFile(skinPath);
        const steveSkinImage = (await Jimp.Jimp.read(skinTexture, { "image/png": {} })).bitmap;
        const steveGeometry = {
            "format_version": "1.12.0",
            "minecraft:geometry": [
                {
                    "description": {
                        "identifier": "geometry.cape",
                        "texture_width": 64,
                        "texture_height": 32
                    },
                    "bones": [
                        {
                            "name": "body",
                            "pivot": [0.0, 24.0, 0.0],
                            "parent": "waist"
                        },
                        {
                            "name": "waist",
                            "pivot": [0.0, 12.0, 0.0]
                        },
                        {
                            "name": "cape",
                            "parent": "body",
                            "pivot": [0.0, 24.0, 3.0],
                            "rotation": [0.0, 180.0, 0.0],
                            "cubes": [
                                {
                                    "origin": [-5.0, 8.0, 3.0],
                                    "size": [10, 16, 1],
                                    "uv": [0, 0]
                                }
                            ]
                        }
                    ]
                },
                {
                    "description": {
                        "identifier": "geometry.humanoid.steve",
                        "visible_bounds_width": 1,
                        "visible_bounds_height": 2,
                        "visible_bounds_offset": [0, 1, 0],
                        "texture_width": 64,
                        "texture_height": 64
                    },
                    "bones": [
                        {
                            "name": "root",
                            "pivot": [0.0, 0.0, 0.0]
                        },
                        {
                            "name": "body",
                            "parent": "waist",
                            "pivot": [0.0, 24.0, 0.0],
                            "cubes": [
                                {
                                    "origin": [-4.0, 12.0, -2.0],
                                    "size": [8, 12, 4],
                                    "uv": [16, 16]
                                }
                            ]
                        },

                        {
                            "name": "waist",
                            "parent": "root",
                            "pivot": [0.0, 12.0, 0.0]
                        },

                        {
                            "name": "head",
                            "parent": "body",
                            "pivot": [0.0, 24.0, 0.0],
                            "cubes": [
                                {
                                    "origin": [-4.0, 24.0, -4.0],
                                    "size": [8, 8, 8],
                                    "uv": [0, 0]
                                }
                            ]
                        },

                        {
                            "name": "cape",
                            "pivot": [0.0, 24, 3.0],
                            "parent": "body"
                        },
                        {
                            "name": "hat",
                            "parent": "head",
                            "pivot": [0.0, 24.0, 0.0],
                            "cubes": [
                                {
                                    "origin": [-4.0, 24.0, -4.0],
                                    "size": [8, 8, 8],
                                    "uv": [32, 0],
                                    "inflate": 0.5
                                }
                            ]
                        },
                        {
                            "name": "leftArm",
                            "parent": "body",
                            "pivot": [5.0, 22.0, 0.0],
                            "cubes": [
                                {
                                    "origin": [4.0, 12.0, -2.0],
                                    "size": [4, 12, 4],
                                    "uv": [32, 48]
                                }
                            ]
                        },
                        {
                            "name": "leftSleeve",
                            "parent": "leftArm",
                            "pivot": [5.0, 22.0, 0.0],
                            "cubes": [
                                {
                                    "origin": [4.0, 12.0, -2.0],
                                    "size": [4, 12, 4],
                                    "uv": [48, 48],
                                    "inflate": 0.25
                                }
                            ]
                        },
                        {
                            "name": "leftItem",
                            "pivot": [6.0, 15.0, 1.0],
                            "parent": "leftArm"
                        },
                        {
                            "name": "rightArm",
                            "parent": "body",
                            "pivot": [-5.0, 22.0, 0.0],
                            "cubes": [
                                {
                                    "origin": [-8.0, 12.0, -2.0],
                                    "size": [4, 12, 4],
                                    "uv": [40, 16]
                                }
                            ]
                        },
                        {
                            "name": "rightSleeve",
                            "parent": "rightArm",
                            "pivot": [-5.0, 22.0, 0.0],
                            "cubes": [
                                {
                                    "origin": [-8.0, 12.0, -2.0],
                                    "size": [4, 12, 4],
                                    "uv": [40, 32],
                                    "inflate": 0.25
                                }
                            ]
                        },
                        {
                            "name": "rightItem",
                            "pivot": [-6, 15, 1],
                            "locators": {
                                "lead_hold": [-6, 15, 1]
                            },
                            "parent": "rightArm"
                        },

                        {
                            "name": "leftLeg",
                            "parent": "root",
                            "pivot": [1.9, 12.0, 0.0],
                            "cubes": [
                                {
                                    "origin": [-0.1, 0.0, -2.0],
                                    "size": [4, 12, 4],
                                    "uv": [16, 48]
                                }
                            ]
                        },
                        {
                            "name": "leftPants",
                            "parent": "leftLeg",
                            "pivot": [1.9, 12.0, 0.0],
                            "cubes": [
                                {
                                    "origin": [-0.1, 0.0, -2.0],
                                    "size": [4, 12, 4],
                                    "uv": [0, 48],
                                    "inflate": 0.25
                                }
                            ]
                        },

                        {
                            "name": "rightLeg",
                            "parent": "root",
                            "pivot": [-1.9, 12.0, 0.0],
                            "cubes": [
                                {
                                    "origin": [-3.9, 0.0, -2.0],
                                    "size": [4, 12, 4],
                                    "uv": [0, 16]
                                }
                            ]
                        },
                        {
                            "name": "rightPants",
                            "parent": "rightLeg",
                            "pivot": [-1.9, 12.0, 0.0],
                            "cubes": [
                                {
                                    "origin": [-3.9, 0.0, -2.0],
                                    "size": [4, 12, 4],
                                    "uv": [0, 32],
                                    "inflate": 0.25
                                }
                            ]
                        },

                        {
                            "name": "jacket",
                            "parent": "body",
                            "pivot": [0.0, 24.0, 0.0],
                            "cubes": [
                                {
                                    "origin": [-4.0, 12.0, -2.0],
                                    "size": [8, 12, 4],
                                    "uv": [16, 32],
                                    "inflate": 0.25
                                }
                            ]
                        }
                    ]
                }
            ]
        } as MinecraftGeometryFile;
        const geometryKey = "geometry.humanoid.steve";
        // Construct new serialized skin and update vanity.
        const identifier = uuid() + "." + "vanity";
        // Get player vanity info.
        const vanityItems = player.getEquippedVanity();
        // Create vanity augmented skin texture.
        const newSkinImage = await augmentSkinAndUV(steveSkinImage, vanityItems);
        // Create vanity augmented geometry.
        const newGeometry = augmentGeometry(steveGeometry["minecraft:geometry"].find((x: GeometryDefinition) => x.description.identifier === geometryKey)!, "1.12.0", geometryKey, "modern", vanityItems);
        // Compile array of vanity item animations.
        const animations = vanityItems.filter((v): v is VanityInfo => v !== null && !!v.animations).flatMap(v => v.animations!) as SkinAnimation[];
        const newSkin = new SerializedSkin(identifier, serializedSkin.playFabIdentifier, JSON.stringify({ geometry: { default: geometryKey } }), { width: 128, height: 128, data: newSkinImage }, animations ?? [], new SkinImage(0, 0, Buffer.from([])), JSON.stringify(newGeometry), newGeometry.format_version, "", serializedSkin.capeIdentifier, identifier, serializedSkin.armSize, "#0", [], [], true, true, false, true, true);

        // Send skin update packet.
        const packet = new PlayerSkinPacket();
        packet.uuid = player.uuid;
        packet.skin = newSkin;
        packet.skinName = identifier;
        packet.oldSkinName = oldIdentifier;
        packet.isVerified = true;

        player.world.broadcast(packet)
    }
}

export { VanitySkin }