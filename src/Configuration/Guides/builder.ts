import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { GuideCategory, GuideEntry } from "../../Types/Guide";
import { GuideCategories, GuideEntries } from "./guide";
import { basename, resolve } from "node:path";

const guidesDirectory = resolve("./guides")

function processDirectory(directory: string, parentCategory: GuideCategory | null) {
    const items = readdirSync(directory, { withFileTypes: true });

    for (const item of items) {
        if (item.isDirectory()) {
            const categoryFilePath = resolve(directory, item.name, "category.json");
            if (existsSync(categoryFilePath)) {
                const categoryInfo = JSON.parse(readFileSync(categoryFilePath, "utf-8"));
                const category: GuideCategory = {
                    title: categoryInfo.title,
                    guides: categoryInfo.guides || [],
                    categories: [],
                };
                GuideCategories.set(categoryInfo.id, category);
                if (parentCategory) {
                    parentCategory.categories.push(categoryInfo.id);
                }
                processDirectory(resolve(directory, item.name), category);
            }
        }
    }

    const currentCategoryFilePath = resolve(directory, "category.json");
    if (existsSync(currentCategoryFilePath)) {
        const categoryInfo = JSON.parse(readFileSync(currentCategoryFilePath, "utf-8"));

        if (categoryInfo.guides && Array.isArray(categoryInfo.guides)) {
            const category = GuideCategories.get(categoryInfo.id);
            if (!category) return;

            for (const guideId of categoryInfo.guides) {
                const guideFilePath = resolve(directory, `${guideId}.json`);

                if (existsSync(guideFilePath)) {
                    const guideContent = readFileSync(guideFilePath, "utf-8");
                    const guide: GuideEntry = JSON.parse(guideContent);

                    GuideEntries.set(guideId, guide);

                } else {
                    console.warn(`Guide file not found: ${guideFilePath}`);
                }
            }
        }
    }
}

const rootCategoryFilePath = resolve(guidesDirectory, "category.json");
if (existsSync(rootCategoryFilePath)) {
    const rootCategoryInfo = JSON.parse(readFileSync(rootCategoryFilePath, "utf-8"));
    const rootCategory: GuideCategory = {
        title: rootCategoryInfo.title,
        guides: rootCategoryInfo.guides || [],
        categories: []
    };
    GuideCategories.set(rootCategoryInfo.id, rootCategory);
    processDirectory(guidesDirectory, rootCategory);
} else {
    processDirectory(guidesDirectory, null);
}

processDirectory(guidesDirectory, null);

export { GuideCategories, GuideEntries };