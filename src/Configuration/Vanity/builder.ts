import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { VanityItems } from "./vanity";
import { VanityInfo } from "../../Types/Vanity/vanity";

const preservedParentReferences = new Set<string>([
    "root",
    "waist",
    "body",
    "head",
    "hat",
    "cape",
    "leftArm",
    "leftSleeve",
    "leftItem",
    "rightArm",
    "rightSleeve",
    "rightItem",
    "jacket",
    "leftLeg",
    "leftPants",
    "rightLeg",
    "rightPants"
]);

const vanityPath = resolve("./vanity");

function encodeBoneNames(data: any, vanityDef: VanityInfo): any {
    if (Array.isArray(data)) {
        data.forEach(item => encodeBoneNames(item, vanityDef));
    }
    else if (data && typeof data === 'object') {
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const value = data[key];

                if (key === 'bones' && Array.isArray(value)) {

                    const nameMap = new Map<string, string>();

                    value.forEach(bone => {
                        if (bone && typeof bone === 'object' && typeof bone.name === 'string') {
                            const oldName = bone.name;

                            // Rename unless parent reference is preserved.
                            if (!preservedParentReferences.has(oldName.replace(/[-][a-z]$/, ""))) {
                                const newName = `${Math.random().toString(36).substring(2, 8)}_${oldName}`;
                                nameMap.set(oldName, newName);
                                bone.name = newName;
                                if (!bone.parent) bone.parent = vanityDef.bone;
                            }
                        }
                    });

                    value.forEach(bone => {
                        if (bone && typeof bone === 'object' && typeof bone.parent === 'string') {
                            const parentName = bone.parent;

                            // Update parent references.
                            if (nameMap.has(parentName)) {
                                bone.parent = nameMap.get(parentName);
                            }
                        }
                    });

                    value.forEach(bone => encodeBoneNames(bone, vanityDef));

                } else {
                    encodeBoneNames(value, vanityDef);
                }
            }
        }
    }

    // Return the modified data
    return data;
}

if (existsSync(vanityPath)) {
    const vanityFolders = readdirSync(vanityPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    for (const folder of vanityFolders) {
        const vanityJsonPath = resolve(vanityPath, folder, "vanity.json");
        if (existsSync(vanityJsonPath)) {
            try {
                const vanityJsonContent = readFileSync(vanityJsonPath, "utf-8");
                const vanityInfo: VanityInfo = JSON.parse(vanityJsonContent);

                const geometryPath = resolve(vanityPath, folder, `${vanityInfo.geometry ?? vanityInfo.id}.geo.json`);
                const texturePath = resolve(vanityPath, folder, `${vanityInfo.texture ?? vanityInfo.id}.png`);

                if (existsSync(geometryPath) && existsSync(texturePath)) {
                    const animations: any[] = [];
                    const files = readdirSync(resolve(vanityPath, folder));

                    for (const file of files) {
                        if (file.endsWith(".animation.json")) {
                            const animationPath = resolve(vanityPath, folder, file);
                            const animationContent = readFileSync(animationPath, "utf-8");
                            animations.push(JSON.parse(animationContent));
                        }
                    }

                    const geometry = encodeBoneNames(JSON.parse(readFileSync(geometryPath, "utf-8")), vanityInfo);

                    VanityItems.set(vanityInfo.id, {
                        ...vanityInfo,
                        geometry: geometry,
                        texture: readFileSync(texturePath).toString("base64"),
                        animations: animations
                    });
                    console.log(`[Vanity] Loaded vanity item: ${vanityInfo.name}`);
                } else {
                    if (!existsSync(geometryPath)) {
                        console.error(`[Vanity] Missing geometry file for ${vanityInfo.id}: ${geometryPath}`);
                    }
                    if (!existsSync(texturePath)) {
                        console.error(`[Vanity] Missing texture file for ${vanityInfo.id}: ${texturePath}`);
                    }
                }
            } catch (error) {
                console.error(`[Vanity] Error loading vanity item from ${folder}:`, error);
            }
        }
    }
} else {
    console.log("[Vanity] 'vanity' directory not found, skipping vanity loading.");
}