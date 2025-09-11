class IslandLevel {
    public static fromPoints(points: number): number {
        if (points < 0) {
            return 0;
        }
        const level = Math.floor((Math.sqrt(1 + points / 18.75) - 1) / 2 + 1e-9) + 1;

        return level < 1 ? 1 : level;
    }

    public static toPoints(level: number): number {
        if (level <= 0) {
            return 0;
        }
        return 75 * level * (level + 1);
    }

    public static pointsToNextLevel(points: number): number {
        const currentLevel = this.fromPoints(points);
        return this.toPoints(currentLevel + 1);
    }
}

export { IslandLevel };