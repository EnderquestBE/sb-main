type GuideCategory = {
    /* Title to display for the category. */
    title: string;
    /* List of guide IDs that belong to this category. */
    guides: string[];
    /* List of sub-category IDs that belong to this category. */
    categories: string[];
}

export { GuideCategory }