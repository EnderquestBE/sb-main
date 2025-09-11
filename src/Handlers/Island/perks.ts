import { Island } from "../../Classes/classes"

interface IslandPerkType {
    id: string, // The ID associated with the perk.
    name: string, // The display name for the perk.
    unlock: {
        function?: (island: Island) => void // Callback to execute when the perk is unlocked.
        permissions?: string[] // Permission strings to grant when the perk is unlocked.
    },
    level: number // Level at which the perk is unlocked for the island.
}

class IslandPerkUnlocks {
    private static perks: {
        fly: IslandPerkType
    } = {
            fly: {
                id: "flight",
                name: "Flight",
                unlock: {
                    function: (island) => {
                        island.addCommandPermission("enderquest.fly")
                    }
                },
                level: 100
            }
        }

    private static onUnlock(island: Island, perk: IslandPerkType) {
        if (perk.unlock.function) {
            perk.unlock.function(island)
        }
        if (perk.unlock.permissions) {
            for (let permission of perk.unlock.permissions) {
                island.addCommandPermission(permission)
            }
        }
    }

    public static get(id: keyof typeof IslandPerkUnlocks.perks): IslandPerkType | undefined {
        return this.perks[id]
    }

    public static update(island: Island) {
        const perks = Object.values(this.perks)
        for (const perk of perks) {
            if (island.hasPerk(perk.id)) continue
            const level = island.getLevel()
            if (level >= perk.level) {
                island.addPerk(perk.id)
            }
            this.onUnlock(island, perk)
        }
    }
}

export { IslandPerkUnlocks }