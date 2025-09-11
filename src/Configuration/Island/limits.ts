import { IslandLimitType } from "../../Types/types";

const IslandLimitConfig: { [key in IslandLimitType]?: { increase: number, max: number } } = {
    crops: { increase: 250, max: 3500 },
    spawners: { increase: 1, max: 10 },
    hoppers: { increase: 1, max: 10 },
}

export { IslandLimitConfig }