import { Island } from "../../Classes/classes"
import { IslandLimitType } from "../../Types/types"

interface IslandLimitUnlock {
    amount: number // Amount to increase the limit by.
    interval?: number, // Limit is increased every X level. If undefined, will only increase on expansion.
    maximum?: number // True maximum the limit can reach.
}

class IslandLimitUnlocks {
    private static limits: {
        [key in IslandLimitType]: IslandLimitUnlock
    } = {
            crops: {
                amount: 225,
                maximum: 4675
            },
            spawners: {
                amount: 1,
                maximum: 20
            },
            hoppers: {
                amount: 1,
                maximum: 10,
            },
            coowners: {
                amount: 1,
                maximum: 3,
                interval: 30
            },
            members: {
                amount: 1,
                maximum: 10
            },
            homes: {
                amount: 1,
                maximum: 10,
                interval: 20
            },
            bank: {
                interval: 1,
                amount: 25000
            },
        }

    public static get(limit: IslandLimitType) {
        return this.limits[limit]
    }

    public static update(island: Island, expansion: boolean = false) {
        const level = island.getLevel()
        if (level < island.getLevelCeil()) return
        const limits = Object.entries(this.limits)
        const changes: { [key in IslandLimitType]?: number } = {}
        if (expansion)
            for (const [key, limit] of limits) {
                if (limit.interval) continue
                if (limit.maximum && island.getLimit(key as IslandLimitType).max >= limit.maximum) continue
                island.increaseMaxLimit(key as IslandLimitType, limit.amount)
                changes[key as IslandLimitType] = limit.amount
            }
        else
            for (const [key, limit] of limits) {
                if (!limit.interval) continue
                if (level % limit.interval !== 0) continue
                if (limit.maximum && island.getLimit(key as IslandLimitType).max >= limit.maximum) continue
                island.increaseMaxLimit(key as IslandLimitType, limit.amount)
                changes[key as IslandLimitType] = limit.amount
            }
        return changes
    }
}

export { IslandLimitUnlocks }