const SlapperVisitGeometry = JSON.stringify({
    "format_version": "1.8.0",
    "geometry.MiniGameHeroes.MiniGameHeroesCowGlider": {
        "bones": [
            {
                "cubes": [
                    {
                        "inflate": 0.0,
                        "mirror": false,
                        "origin": [-4.0, 12.0, -2.0],
                        "size": [8.0, 12.0, 4.0],
                        "uv": [16.0, 16.0]
                    }
                ],
                "name": "body",
                "parent": "waist",
                "pivot": [0.0, 24.0, 0.0],
                "rotation": [0.0, 0.0, 0.0]
            },
            {
                "cubes": [
                    {
                        "inflate": 0.0,
                        "mirror": false,
                        "origin": [-4.0, 24.0, -4.0],
                        "size": [8.0, 8.0, 8.0],
                        "uv": [0.0, 0.0]
                    }
                ],
                "name": "head",
                "parent": "body",
                "pivot": [0.0, 24.0, 0.0],
                "rotation": [0.0, 0.0, 0.0]
            },
            {
                "cubes": [
                    {
                        "inflate": 0.50,
                        "mirror": false,
                        "origin": [-4.0, 24.0, -4.0],
                        "size": [8.0, 8.0, 8.0],
                        "uv": [32.0, 0.0]
                    }
                ],
                "name": "hat",
                "parent": "head",
                "pivot": [0.0, 24.0, 0.0],
                "rotation": [0.0, 0.0, 0.0]
            },
            {
                "cubes": [
                    {
                        "inflate": 0.0,
                        "mirror": true,
                        "origin": [4.0, 11.50, -2.0],
                        "size": [3.0, 12.0, 4.0],
                        "uv": [40.0, 16.0]
                    }
                ],
                "name": "leftArm",
                "parent": "body",
                "pivot": [5.0, 21.50, 0.0],
                "render_group_id": 1,
                "rotation": [0.0, 0.0, 0.0]
            },
            {
                "cubes": [
                    {
                        "inflate": 0.0,
                        "mirror": false,
                        "origin": [-7.0, 11.50, -2.0],
                        "size": [3.0, 12.0, 4.0],
                        "uv": [40.0, 16.0]
                    }
                ],
                "name": "rightArm",
                "parent": "body",
                "pivot": [-5.0, 21.50, 0.0],
                "render_group_id": 1,
                "rotation": [0.0, 0.0, 0.0]
            },
            {
                "cubes": [],
                "name": "leftSleeve",
                "parent": "leftArm",
                "pivot": [5.0, 21.50, 0.0],
                "render_group_id": 1,
                "rotation": [0.0, 0.0, 0.0]
            },
            {
                "cubes": [],
                "name": "rightSleeve",
                "parent": "rightArm",
                "pivot": [-5.0, 21.50, 0.0],
                "render_group_id": 1,
                "rotation": [0.0, 0.0, 0.0]
            },
            {
                "cubes": [
                    {
                        "inflate": 0.0,
                        "mirror": false,
                        "origin": [-0.10, 0.0, -2.0],
                        "size": [4.0, 12.0, 4.0],
                        "uv": [16.0, 48.0]
                    }
                ],
                "name": "leftLeg",
                "parent": "root",
                "pivot": [1.90, 12.0, 0.0],
                "rotation": [0.0, 0.0, 0.0]
            },
            {
                "cubes": [
                    {
                        "inflate": 0.0,
                        "mirror": false,
                        "origin": [-3.90, 0.0, -2.0],
                        "size": [4.0, 12.0, 4.0],
                        "uv": [0.0, 16.0]
                    }
                ],
                "name": "rightLeg",
                "parent": "root",
                "pivot": [-1.90, 12.0, 0.0],
                "rotation": [0.0, 0.0, 0.0]
            },
            {
                "cubes": [
                    {
                        "inflate": 0.250,
                        "mirror": false,
                        "origin": [-0.10, 0.0, -2.0],
                        "size": [4.0, 12.0, 4.0],
                        "uv": [0.0, 48.0]
                    }
                ],
                "name": "leftPants",
                "parent": "leftLeg",
                "pivot": [1.90, 12.0, 0.0],
                "rotation": [0.0, 0.0, 0.0]
            },
            {
                "cubes": [
                    {
                        "inflate": 0.250,
                        "mirror": false,
                        "origin": [-3.90, 0.0, -2.0],
                        "size": [4.0, 12.0, 4.0],
                        "uv": [0.0, 32.0]
                    }
                ],
                "name": "rightPants",
                "parent": "rightLeg",
                "pivot": [-1.90, 12.0, 0.0],
                "rotation": [0.0, 0.0, 0.0]
            },
            {
                "cubes": [],
                "name": "jacket",
                "parent": "body",
                "pivot": [0.0, 24.0, 0.0],
                "rotation": [0.0, 0.0, 0.0]
            },
            {
                "cubes": [],
                "name": "waist",
                "parent": "root",
                "pivot": [0.0, 12.0, 0.0],
                "rotation": [0.0, 0.0, 0.0]
            },
            {
                "cubes": [],
                "name": "rightItem",
                "parent": "rightArm",
                "pivot": [-6.0, 14.50, 1.0],
                "render_group_id": 1,
                "rotation": [0.0, 0.0, 0.0]
            },
            {
                "cubes": [],
                "name": "leftItem",
                "parent": "leftArm",
                "pivot": [6.0, 14.50, 1.0],
                "render_group_id": 1,
                "rotation": [0.0, 0.0, 0.0]
            },
            {
                "cubes": [
                    {
                        "inflate": 0.0,
                        "mirror": false,
                        "origin": [-5.0, 24.0, -4.0],
                        "size": [1.0, 10.0, 8.0],
                        "uv": [46.0, 24.0]
                    },
                    {
                        "inflate": 0.0,
                        "mirror": true,
                        "origin": [4.0, 24.0, -4.0],
                        "size": [1.0, 10.0, 8.0],
                        "uv": [46.0, 24.0]
                    },
                    {
                        "inflate": 0.0,
                        "mirror": false,
                        "origin": [-4.0, 32.0, -4.0],
                        "size": [8.0, 2.0, 8.0],
                        "uv": [32.0, 54.0]
                    },
                    {
                        "inflate": 0.0,
                        "mirror": false,
                        "origin": [-6.0, 32.0, -1.0],
                        "size": [1.0, 3.0, 1.0],
                        "uv": [0.0, 16.0]
                    },
                    {
                        "inflate": 0.0,
                        "mirror": true,
                        "origin": [5.0, 32.0, -1.0],
                        "size": [1.0, 3.0, 1.0],
                        "uv": [0.0, 16.0]
                    }
                ],
                "name": "helmet",
                "parent": "head",
                "pivot": [0.0, 24.0, 0.0],
                "rotation": [0.0, 0.0, 0.0]
            },
            {
                "cubes": [
                    {
                        "inflate": 0.0,
                        "mirror": false,
                        "origin": [-2.0, 15.0, -2.90],
                        "size": [4.0, 4.0, 1.0],
                        "uv": [25.0, 2.0]
                    }
                ],
                "name": "belt",
                "parent": "body",
                "pivot": [0.0, 24.0, 0.0],
                "rotation": [0.0, 0.0, 0.0]
            },
            {
                "name": "root",
                "pivot": [0.0, 0.0, 0.0]
            }
        ],
        "textureheight": 64,
        "texturewidth": 64
    }
})

export { SlapperVisitGeometry }