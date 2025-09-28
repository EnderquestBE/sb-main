const PigGeometry = JSON.stringify({
    "format_version": "1.10.0",
    "geometry.pig": {
        "texturewidth": 64,
        "textureheight": 64,
        "visible_bounds_width": 3,
        "visible_bounds_height": 2.25,
        "visible_bounds_offset": [0, 0.875, 0],
        "bones": [
            {
                "name": "root",
                "pivot": [0, 13, 3]
            },
            {
                "name": "waist",
                "parent": "root",
                "pivot": [0, 13, 3]
            },
            {
                "name": "body",
                "parent": "waist",
                "pivot": [0, 13, 3],
                "rotation": [90, 0, 0],
                "cubes": [
                    { "origin": [-5, 7, -4], "size": [10, 16, 8], "uv": [28, 8] }
                ]
            },
            {
                "name": "head",
                "parent": "body",
                "pivot": [0, 22, 2],
                "rotation": [-90, 0, 0],
                "cubes": [
                    { "origin": [-4, 18, -6], "size": [8, 8, 8], "uv": [0, 0] },
                    { "origin": [-2, 19, -7], "size": [4, 3, 1], "uv": [16, 16] }
                ]
            },
            {
                "name": "rightArm",
                "parent": "body",
                "pivot": [-3, 21, -4],
                "rotation": [-90, 0, 0],
                "cubes": [
                    { "origin": [-5, 15, -6], "size": [4, 6, 4], "uv": [0, 16] }
                ]
            },
            {
                "name": "rightItem",
                "parent": "rightArm",
                "pivot": [-4, 17.5, -4],
                "locators": {
                    "lead_hold": [-4, 17.5, -4]
                }
            },
            {
                "name": "leftArm",
                "parent": "body",
                "pivot": [3, 21, -4],
                "rotation": [-90, 0, 0],
                "mirror": true,
                "cubes": [
                    { "origin": [1, 15, -6], "size": [4, 6, 4], "uv": [0, 16] }
                ]
            },
            {
                "name": "leftItem",
                "parent": "leftArm",
                "pivot": [4, 17.5, -4]
            },
            {
                "name": "rightLeg",
                "pivot": [-3, 6, 7],
                "cubes": [
                    { "origin": [-5, 0, 5], "size": [4, 6, 4], "uv": [0, 16] }
                ]
            },
            {
                "name": "leftLeg",
                "pivot": [3, 6, 7],
                "mirror": true,
                "cubes": [
                    { "origin": [1, 0, 5], "size": [4, 6, 4], "uv": [0, 16] }
                ]
            }
        ]
    }
})

export { PigGeometry }