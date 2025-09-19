import { Player } from "@serenityjs/core"
import { Island } from "../../Classes/classes"

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
                    permissions: ["enderquest.fly"]
                },
                level: 100
            }
        }

    public static applyPermissions(player: Player, island: Island) {
        const islandPerks = island.getPerks();
        for (const perkId of islandPerks) {
            const perk = this.perks[perkId as keyof typeof this.perks];
            if (perk?.unlock.permissions) {
                for (const permission of perk.unlock.permissions) {
                    player.addPermission(permission);
                }
            }
        }
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