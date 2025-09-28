import { Player } from "@serenityjs/core"
import { Island } from "../.."

interface IslandPerkType {
    id: string, // The ID associated with the perk.
    name: string, // The display name for the perk.
    unlock: {
        permissions?: string[] // Permission strings to grant when the perk is unlocked.
    },
    level: number // Level at which the perk is unlocked for the island.
}

class IslandPerkUnlocks {
    private static perks: {
        flight: IslandPerkType
    } = {
            flight: {
                id: "flight",
                name: "Flight",
                unlock: {
                    permissions: ["island.fly"]
                },
                level: 100
            }
        }

    public static applyPermissions(player: Player, island: Island) {
        // Remove all island perk permissions first.
        const newPermissions = player.permissions.permissions.filter((x) => !x.startsWith("island."))
        newPermissions.push(...island.getPerks().flatMap((perkId) => {
            const perk = this.perks[perkId as keyof typeof this.perks];
            return perk?.unlock.permissions ?? []
        }))
        player.permissions.permissions = newPermissions
    }

    public static getAll(): IslandPerkType[] {
        return Object.values(this.perks)
    }

    public static get(id: keyof typeof IslandPerkUnlocks.perks): IslandPerkType | undefined {
        return this.perks[id]
    }

    public static update(island: Island) {
        const currentCeil = island.getLevelCeil();
        for (const perk of Object.values(this.perks)) {
            if (island.hasPerk(perk.id)) continue;

            if (currentCeil >= perk.level) {
                island.addPerk(perk.id).then(() => {
                    const onlineOwners = island.getOnlineOwners();
                    for (const owner of onlineOwners) {
                        this.applyPermissions(owner, island);
                    }
                });
            }
        }
    }
}

export { IslandPerkUnlocks }