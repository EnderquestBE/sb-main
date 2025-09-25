const PalmGeometry = JSON.stringify({
    "format_version": "1.12.0",
    "minecraft:geometry": [
        {
            "description": {
                "identifier": "geometry.palm",
                "texture_width": 64,
                "texture_height": 64,
                "visible_bounds_width": 2,
                "visible_bounds_height": 3,
                "visible_bounds_offset": [0, 1.5, 0]
            },
            "bones": [
                {
                    "name": "root",
                    "pivot": [0, 0, 0]
                },
                {
                    "name": "waist",
                    "parent": "root",
                    "pivot": [0, 12, 0]
                },
                {
                    "name": "body",
                    "parent": "waist",
                    "pivot": [0, 24, 0],
                    "cubes": [
                        { "origin": [-4, 12, -2], "size": [8, 12, 4], "uv": [16, 16] }
                    ]
                },
                {
                    "name": "head",
                    "parent": "body",
                    "pivot": [0, 24, 0],
                    "cubes": [
                        { "origin": [-4, 24, -4], "size": [8, 8, 8], "uv": [0, 0] }
                    ]
                },
                {
                    "name": "hat",
                    "parent": "head",
                    "pivot": [0, 24, 0],
                    "cubes": [
                        { "origin": [-4, 24, -4], "size": [8, 8, 8], "inflate": 0.5, "uv": [32, 0] }
                    ]
                },
                {
                    "name": "tophat",
                    "parent": "hat",
                    "pivot": [0, 32, 0],
                    "cubes": [
                        {
                            "origin": [-4.1, 31, -4.1],
                            "size": [8.2, 2, 8.2],
                            "uv": {
                                "north": { "uv": [1, 60], "uv_size": [-1, 1] },
                                "east": { "uv": [1, 60], "uv_size": [-1, 1] },
                                "south": { "uv": [1, 60], "uv_size": [-1, 1] },
                                "west": { "uv": [1, 60], "uv_size": [-1, 1] },
                                "up": { "uv": [0, 61], "uv_size": [1, -1] },
                                "down": { "uv": [0, 61], "uv_size": [1, -1] }
                            }
                        },
                        {
                            "origin": [-6, 30, -6],
                            "size": [12, 1.5, 12],
                            "uv": {
                                "north": { "uv": [0, 63], "uv_size": [1, 1] },
                                "east": { "uv": [0, 63], "uv_size": [1, 1] },
                                "south": { "uv": [0, 63], "uv_size": [1, 1] },
                                "west": { "uv": [0, 63], "uv_size": [1, 1] },
                                "up": { "uv": [0, 63], "uv_size": [1, 1] },
                                "down": { "uv": [0, 64], "uv_size": [1, -1] }
                            }
                        },
                        {
                            "origin": [-4.1, 33, -4.1],
                            "size": [8.2, 6, 8.2],
                            "uv": {
                                "north": { "uv": [0, 63], "uv_size": [1, 1] },
                                "east": { "uv": [0, 63], "uv_size": [1, 1] },
                                "south": { "uv": [0, 63], "uv_size": [1, 1] },
                                "west": { "uv": [0, 63], "uv_size": [1, 1] },
                                "up": { "uv": [0, 63], "uv_size": [1, 1] },
                                "down": { "uv": [0, 64], "uv_size": [1, -1] }
                            }
                        }
                    ]
                },
                {
                    "name": "leftArm",
                    "parent": "body",
                    "pivot": [5, 21.5, 0],
                    "cubes": [
                        { "origin": [4, 11.5, -2], "size": [3, 12, 4], "uv": [32, 48] }
                    ]
                },
                {
                    "name": "leftSleeve",
                    "parent": "leftArm",
                    "pivot": [5, 21.5, 0],
                    "cubes": [
                        { "origin": [4, 11.5, -2], "size": [3, 12, 4], "inflate": 0.25, "uv": [48, 48] }
                    ]
                },
                {
                    "name": "leftItem",
                    "parent": "leftArm",
                    "pivot": [6, 14.5, 1]
                },
                {
                    "name": "rightArm",
                    "parent": "body",
                    "pivot": [-5, 21.5, 0],
                    "cubes": [
                        { "origin": [-7, 11.5, -2], "size": [3, 12, 4], "uv": [40, 16] }
                    ]
                },
                {
                    "name": "rightSleeve",
                    "parent": "rightArm",
                    "pivot": [-5, 21.5, 0],
                    "cubes": [
                        { "origin": [-7, 11.5, -2], "size": [3, 12, 4], "inflate": 0.25, "uv": [40, 32] }
                    ]
                },
                {
                    "name": "rightItem",
                    "parent": "rightArm",
                    "pivot": [-6, 14.5, 1],
                    "locators": {
                        "lead_hold": [-6, 14.5, 1]
                    }
                },
                {
                    "name": "jacket",
                    "parent": "body",
                    "pivot": [0, 24, 0],
                    "cubes": [
                        { "origin": [-4, 12, -2], "size": [8, 12, 4], "inflate": 0.25, "uv": [16, 32] }
                    ]
                },
                {
                    "name": "cape",
                    "parent": "body",
                    "pivot": [0, 24, -3]
                },
                {
                    "name": "rightLeg",
                    "parent": "root",
                    "pivot": [-1.9, 12, 0],
                    "cubes": [
                        { "origin": [-3.9, 0, -2], "size": [4, 12, 4], "uv": [0, 16] }
                    ]
                },
                {
                    "name": "rightPants",
                    "parent": "rightLeg",
                    "pivot": [-1.9, 12, 0],
                    "cubes": [
                        { "origin": [-3.9, 0, -2], "size": [4, 12, 4], "inflate": 0.25, "uv": [0, 32] }
                    ]
                },
                {
                    "name": "leftLeg",
                    "parent": "root",
                    "pivot": [1.9, 12, 0],
                    "mirror": true,
                    "cubes": [
                        { "origin": [-0.1, 0, -2], "size": [4, 12, 4], "uv": [0, 16] }
                    ]
                },
                {
                    "name": "leftPants",
                    "parent": "leftLeg",
                    "pivot": [1.9, 12, 0],
                    "cubes": [
                        { "origin": [-0.1, 0, -2], "size": [4, 12, 4], "inflate": 0.25, "uv": [0, 48] }
                    ]
                }
            ]
        }
    ]
})

export { PalmGeometry }