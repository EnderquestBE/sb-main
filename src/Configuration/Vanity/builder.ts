import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { VanityItems } from "./vanity";
import { VanityInfo } from "../../Types/Vanity/vanity";

const vanityPath = resolve("./vanity");

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

                    VanityItems.set(vanityInfo.id, {
                        ...vanityInfo,
                        geometry: JSON.parse(readFileSync(geometryPath, "utf-8")),
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