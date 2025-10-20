/** Represents a texture coordinate tuple [u, v]. */
type UVTuple = [number, number];

/** Represents the UV mapping for a single face of a cube. */
interface UVFace {
    uv: UVTuple;
    uv_size?: [number, number];
}

/** Represents a single cube within a model's bone. */
interface Cube {
    origin: [number, number, number];
    size: [number, number, number];
    uv: UVTuple | {
        north?: UVFace;
        east?: UVFace;
        south?: UVFace;
        west?: UVFace;
        up?: UVFace;
        down?: UVFace;
    };
    inflate?: number;
    mirror?: boolean;
}

/** Represents a bone in the model's skeleton. */
interface Bone {
    name: string;
    pivot: [number, number, number];
    parent?: string;
    cubes?: Cube[];
    [key: string]: any; // Allows for other properties like rotation, etc.
}

/** Represents the description block for a geometry definition. */
interface GeometryDescription {
    identifier: string;
    texture_width: number;
    texture_height: number;
    [key: string]: any;
}

/** Represents a single geometry definition within a file. */
export interface GeometryDefinition {
    description: GeometryDescription;
    bones: Bone[];
}

/** Represents the full structure of a Minecraft Bedrock geometry file. */
export interface MinecraftGeometryFile {
    format_version: string;
    'minecraft:geometry': GeometryDefinition[];
}