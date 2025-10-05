import { ActionForm, CustomEnum, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";
import { GuideCategories, GuideEntries } from "../../Configuration/Guides";

class GuideEnum extends CustomEnum {
    public static readonly identifier = "guide";
    public static options = Array.from(GuideEntries.keys());
}

function showGuide(player: Player, guideId: string, parentCategoryId: string | null) {
    const guide = GuideEntries.get(guideId);
    if (!guide) {
        player.sendMessage("§cError: Could not find the selected guide.");
        return;
    }

    const form = new ActionForm(guide.title, guide.content);
    form.button("Back");
    form.button("Close");

    form.show(player, (result) => {
        if (result === 1) {
            return;
        } else if (parentCategoryId) {
            const parentCategory = GuideCategories.get(parentCategoryId);
            if (parentCategory) {
                showGuideForm(player, parentCategoryId);
            } else {
                showGuideForm(player, null);
            }
        }
    })
}

function showGuideForm(player: Player, categoryId: string | null = null) {
    const form = new ActionForm("Guides");
    const buttonActions: ({ type: 'category' | 'guide' | 'back', id: string | null })[] = [];

    if (categoryId) {
        const category = GuideCategories.get(categoryId);
        if (!category) {
            player.sendMessage("§cError: Category not found.");
            return showGuideForm(player, null);
        }

        form.title = category.title;
        form.content = "Select a category or guide to view.";

        form.button("Back");
        buttonActions.push({ type: 'back', id: null });

        for (const subCategoryId of category.categories) {
            const subCategory = GuideCategories.get(subCategoryId);
            if (subCategory) {
                form.button(subCategory.title);
                buttonActions.push({ type: 'category', id: subCategoryId });
            }
        }

        for (const guideId of category.guides) {
            const guide = GuideEntries.get(guideId);
            if (guide) {
                form.button(guide.title);
                buttonActions.push({ type: 'guide', id: guideId });
            }
        }

    } else {
        form.title = "Guides";
        form.content = "Select a category or guide to view.";

        const allSubCategoryIds = new Set<string>();
        GuideCategories.forEach(cat => {
            cat.categories.forEach(subId => allSubCategoryIds.add(subId));
        });

        for (const [id, category] of GuideCategories.entries()) {
            if (!allSubCategoryIds.has(id)) {
                form.button(category.title);
                buttonActions.push({ type: 'category', id });
            }
        }

        const guidesInCategory = new Set<string>();
        GuideCategories.forEach(cat => {
            cat.guides.forEach(guideId => guidesInCategory.add(guideId));
        });

        for (const [id, guide] of GuideEntries.entries()) {
            if (!guidesInCategory.has(id)) {
                form.button(guide.title);
                buttonActions.push({ type: 'guide', id });
            }
        }
    }

    form.show(player, ((result, error) => {
        if (error || result === null) {
            if (!categoryId) return;
            let parentId: string | null = null;
            for (const [id, cat] of GuideCategories.entries()) {
                if (cat.categories.includes(categoryId!)) {
                    parentId = id;
                    break;
                }
            }
            return showGuideForm(player, parentId);
        }

        const action = buttonActions[result];
        if (!action) return;

        switch (action.type) {
            case 'category':
                showGuideForm(player, action.id);
                break;
            case 'guide':
                showGuide(player, action.id!, categoryId);
                break;
            case 'back':
                let parentId: string | null = null;
                for (const [id, cat] of GuideCategories.entries()) {
                    if (cat.categories.includes(categoryId!)) {
                        parentId = id;
                        break;
                    }
                }
                showGuideForm(player, parentId);
                break;
        }
    }));
}

new CommandBuilder("guide", "Learn the skills of the trade.")
    .setAliases(["guides", "tutorial", "tutorials"])
    .addOverload(
        new CommandOverload({
            identifier: [GuideEnum, true]
        }).onCallback((player, { identifier }) => {
            if (!(player instanceof Player)) return;
            //@ts-ignore
            const guideId = identifier?.result;
            if (guideId) {
                showGuide(player, guideId, null);
            } else {
                showGuideForm(player);
            }
        })
    )
    .register("General");