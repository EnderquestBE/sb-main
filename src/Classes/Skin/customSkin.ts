import { SerializedSkin, SkinImage } from "@serenityjs/protocol";
import { v4 as uuid } from 'uuid';
import { Jimp } from "jimp";

async function getRawPixelData(imageUrl: string): Promise<Buffer> {
    try {
        const image = await Jimp.read(imageUrl);
        return image.bitmap.data;
    } catch (error) {
        //@ts-ignore
        console.error(`Error processing image from URL ${imageUrl}: ${error.message}`);
        return Buffer.alloc(0);
    }
}

async function fetchJSONContent<T>(url: string): Promise<T> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to parse ${url}: ${response.status}`);
        }
        const data: T = await response.json();

        return data;
    } catch (error) {
        console.error(`Error fetching JSON for ${url}:`, error);
        throw error;
    }
}

type CustomSkinOptions = {
    width: number;
    height: number;
    capeUrl: string;
    armSize: "wide" | "slim";
    geometryUrl: string;
    geometry: string;
    geometryKey: string;
}

class CustomSkin {
    private identifier!: string;
    private skin!: SkinImage;
    private cape?: SkinImage;
    private armSize: "wide" | "slim" = "wide";
    private geometry?: any;
    private geometryKey: string = "geometry.npc.steve";

    /**
     * Creates a custom serialized skin object.
     * @param identifier Identifier to use for the skin.
     * @param skinUrl URL to get the skin image from.
     * @param options More skin options.
     */
    public static async from(identifier: string, skinUrl: string, options: Partial<CustomSkinOptions> = {}) {
        const customSkin = new CustomSkin();

        // Set identifier.
        customSkin.identifier = uuid() + "." + identifier;

        // Set skin.
        customSkin.skin = new SkinImage(options.width ?? 64, options.height ?? 64, await getRawPixelData(skinUrl));

        // Properties
        if (options.capeUrl) customSkin.cape = new SkinImage(64, 32, await getRawPixelData(options.capeUrl));
        if (options.geometryUrl) customSkin.geometry = JSON.stringify(await fetchJSONContent(options.geometryUrl));
        else if (options.geometry) customSkin.geometry = options.geometry;
        if (options.geometryKey) customSkin.geometryKey = options.geometryKey;
        if (options.armSize) {
            customSkin.armSize = options.armSize;
            if (options.armSize === "slim" && !options.geometryKey) customSkin.geometryKey = "geometry.npc.alex";
        }
        return customSkin;
    }

    public toSerializedSkin() {
        if (!this.identifier || !this.skin) throw new Error("Custom skin not loaded properly, was unable to load skin or identifier.");
        return new SerializedSkin(this.identifier, "3da7452bb00f183c", JSON.stringify({ geometry: { default: this.geometryKey } }),
            this.skin, [], this.cape ? this.cape : new SkinImage(0, 0, Buffer.from([])), this.geometry ? this.geometry : JSON.stringify({
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
                            "identifier": "geometry.npc.steve",
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
                    },

                    {
                        "description": {
                            "identifier": "geometry.npc.alex",
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
                                "name": "waist",
                                "parent": "root",
                                "pivot": [0.0, 12.0, 0.0]
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
                                "name": "leftLeg",
                                "parent": "root",
                                "pivot": [1.9, 12.0, 0.0],
                                "cubes": [
                                    {
                                        "origin": [-0.1, 0.0, -2.0],
                                        "size": [4, 12, 4],
                                        "uv": [0, 16]
                                    }
                                ],
                                "mirror": true
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
                                "name": "leftArm",
                                "parent": "body",
                                "pivot": [5.0, 21.5, 0.0],
                                "cubes": [
                                    {
                                        "origin": [4.0, 11.5, -2.0],
                                        "size": [3, 12, 4],
                                        "uv": [32, 48]
                                    }
                                ]
                            },
                            {
                                "name": "leftSleeve",
                                "parent": "leftArm",
                                "pivot": [5.0, 21.5, 0.0],
                                "cubes": [
                                    {
                                        "origin": [4.0, 11.5, -2.0],
                                        "size": [3, 12, 4],
                                        "uv": [48, 48],
                                        "inflate": 0.25
                                    }
                                ]
                            },
                            {
                                "name": "leftItem",
                                "pivot": [6, 14.5, 1],
                                "parent": "leftArm"
                            },
                            {
                                "name": "rightArm",
                                "parent": "body",
                                "pivot": [-5.0, 21.5, 0.0],
                                "cubes": [
                                    {
                                        "origin": [-7.0, 11.5, -2.0],
                                        "size": [3, 12, 4],
                                        "uv": [40, 16]
                                    }
                                ]
                            },
                            {
                                "name": "rightSleeve",
                                "parent": "rightArm",
                                "pivot": [-5.0, 21.5, 0.0],
                                "cubes": [
                                    {
                                        "origin": [-7.0, 11.5, -2.0],
                                        "size": [3, 12, 4],
                                        "uv": [40, 32],
                                        "inflate": 0.25
                                    }
                                ]
                            },
                            {
                                "name": "rightItem",
                                "pivot": [-6, 14.5, 1],
                                "locators": {
                                    "lead_hold": [-6, 14.5, 1]
                                },
                                "parent": "rightArm"
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
                            },

                            {
                                "name": "cape",
                                "pivot": [0.0, 24, -3.0],
                                "parent": "body"
                            }
                        ]
                    }
                ]
            }
                , null, 2), "0.0.0", "", "", this.identifier, this.armSize, "#0", [], [], true, false, false, true, false
        )
    }
}

export { CustomSkin, CustomSkinOptions }