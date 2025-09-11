class IslandLevel {
    public static fromPoints(points: number): number {
        let level = 1;
        let requiredPoints = 0;
        while (requiredPoints <= points) {
            requiredPoints += 150 * level;
            if (requiredPoints > points) {
                return level;
            }
            level++;
        }
        return level;
    }

    public static toPoints(level: number): number {
        if (level <= 0) {
            return 0;
        }
        let sum = 0;
        for (let i = 1; i < level; i++) {
            sum += 150 * i;
        }
        return sum;
    }
    public static pointsToNextLevel(points: number): number {
        return this.toPoints(this.fromPoints(points) + 1);
    }
}

export { IslandLevel }