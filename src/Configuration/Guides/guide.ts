import { GuideCategory, GuideEntry } from "../../Types/Guide"

const GuideCategories = new Map<string, GuideCategory>();
const GuideEntries = new Map<string, GuideEntry>();

class Guide {
    private title: string = "Untitled Guide";
    private content: string = "This guide has no content.";

    public setTitle(title: string) {
        this.title = title;
        return this;
    }

    public setContent(content: string) {
        this.content = content;
        return this;
    }

    public toJSON() {
        return {
            title: this.title,
            content: this.content
        }
    }
}

export { Guide, GuideCategories, GuideEntries }