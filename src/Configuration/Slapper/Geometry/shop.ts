const SlapperShopGeometry = JSON.stringify({
    "format_version": "1.8.0",
    "geometry.Redstone.artisan_slim": {
        "bones": [
            {
                "cubes": [
                    {
                        "origin": [-4, 12, -2],
                        "size": [8, 12, 4],
                        "uv": [16, 16]
                    }
                ],
                "name": "body",
                "parent": "waist",
                "pivot": [0, 24, 0]
            },
            {
                "cubes": [
                    {
                        "origin": [-4, 24, -4],
                        "size": [8, 8, 8],
                        "uv": [0, 0]
                    }
                ],
                "name": "head",
                "parent": "body",
                "pivot": [0, 24, 0]
            },
            {
                "cubes": [
                    {
                        "inflate": 0.50,
                        "origin": [-4, 24, -4],
                        "size": [8, 8, 8],
                        "uv": [32, 0]
                    }
                ],
                "name": "hat",
                "parent": "head",
                "pivot": [0, 24, 0]
            },
            {
                "cubes": [
                    {
                        "origin": [-1, 30, 4],
                        "size": [2, 1, 1],
                        "uv": [0, 0]
                    },
                    {
                        "origin": [-1, 26, 5],
                        "size": [2, 6, 2],
                        "uv": [24, 0]
                    }
                ],
                "name": "helmet",
                "parent": "head",
                "pivot": [0, 24, 0]
            },
            {
                "cubes": [
                    {
                        "origin": [4, 11.50, -2],
                        "size": [3, 12, 4],
                        "uv": [32, 48]
                    }
                ],
                "name": "leftArm",
                "parent": "body",
                "pivot": [5.0014480, 21.50, 0],
                "render_group_id": 1
            },
            {
                "cubes": [
                    {
                        "inflate": 0.250,
                        "origin": [4, 11.50, -2],
                        "size": [3, 12, 4],
                        "uv": [48, 48]
                    }
                ],
                "name": "leftSleeve",
                "parent": "leftArm",
                "pivot": [5.0014480, 21.50, 0],
                "render_group_id": 1
            },
            {
                "cubes": [
                    {
                        "origin": [-7, 11.50, -2],
                        "size": [3, 12, 4],
                        "uv": [40, 16]
                    }
                ],
                "name": "rightArm",
                "parent": "body",
                "pivot": [-5, 21.50, 0],
                "render_group_id": 1
            },
            {
                "cubes": [
                    {
                        "inflate": 0.250,
                        "origin": [-7, 11.50, -2],
                        "size": [3, 12, 4],
                        "uv": [40, 32]
                    }
                ],
                "name": "rightSleeve",
                "parent": "rightArm",
                "pivot": [-5, 21.50, 0],
                "render_group_id": 1
            },
            {
                "cubes": [
                    {
                        "inflate": 0.250,
                        "origin": [-4, 12, -2],
                        "size": [8, 12, 4],
                        "uv": [16, 32]
                    }
                ],
                "name": "jacket",
                "parent": "body",
                "pivot": [0, 24, 0]
            },
            {
                "cubes": [
                    {
                        "origin": [0, 0, -2],
                        "size": [4, 12, 4],
                        "uv": [16, 48]
                    }
                ],
                "name": "leftLeg",
                "parent": "root",
                "pivot": [1.90, 12, 0]
            },
            {
                "cubes": [
                    {
                        "inflate": 0.250,
                        "origin": [0, 0, -2],
                        "size": [4, 12, 4],
                        "uv": [0, 48]
                    }
                ],
                "name": "leftPants",
                "parent": "leftLeg",
                "pivot": [1.90, 12, 0]
            },
            {
                "cubes": [
                    {
                        "origin": [-4, 0, -2],
                        "size": [4, 12, 4],
                        "uv": [0, 16]
                    }
                ],
                "name": "rightLeg",
                "parent": "root",
                "pivot": [-1.9005510, 12, 0]
            },
            {
                "cubes": [
                    {
                        "inflate": 0.250,
                        "origin": [-4, 0, -2],
                        "size": [4, 12, 4],
                        "uv": [0, 32]
                    }
                ],
                "name": "rightPants",
                "parent": "rightLeg",
                "pivot": [-1.9005510, 12, 0]
            },
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
                "locators": {
                    "lead_hold": [-6.0, 15.0, 1.0]
                },
                "name": "rightItem",
                "parent": "rightArm",
                "pivot": [-6.0, 15.0, 1.0],
                "render_group_id": 1
            },
            {
                "name": "leftItem",
                "parent": "leftArm",
                "pivot": [6.0, 15.0, 1.0],
                "render_group_id": 1
            }
        ]
    }
})

export { SlapperShopGeometry }