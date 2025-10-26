import { Player, PlayerCommandExecutorTrait } from "@serenityjs/core"
import { Island } from "../../Classes"

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
        sellall: IslandPerkType,
        sellallxp: IslandPerkType,
        flight: IslandPerkType,
        compressall: IslandPerkType
    } = {
            sellall: {
                id: "sellall",
                name: "/sa Access",
                unlock: {
                    permissions: ["rank.sellall"]
                },
                level: 50
            },
            sellallxp: {
                id: "sellallxp",
                name: "/saxp Access",
                unlock: {
                    permissions: ["rank.sellallxp"]
                },
                level: 50
            },
            flight: {
                id: "flight",
                name: "/fly Access",
                unlock: {
                    permissions: ["rank.fly"]
                },
                level: 100
            },
            compressall: {
                id: "compressall",
                name: "/compressall Access",
                unlock: {
                    permissions: ["rank.compressall"]
                },
                level: 125
            }
        }

    public static applyPermissions(player: Player, island: Island) {
        const perks = island.getPerks();
        let permissionsChanged = false;
        for (const perk of perks) {
            const info = this.perks[perk as keyof typeof this.perks];
            if (info.unlock.permissions)
                for (const permission of info.unlock.permissions) {
                    if (!player.hasPermission(permission)) {
                        player.addPermission(permission);
                        permissionsChanged = true;
                    }
                }
        }
        if (permissionsChanged) {
            player.getTrait(PlayerCommandExecutorTrait).sendAvailableCommands();
        }
    }

    public static getAll(): IslandPerkType[] {
        return Object.values(this.perks)
    }

    public static get(id: keyof typeof IslandPerkUnlocks.perks): IslandPerkType | undefined {
        return this.perks[id]
    }

    public static async update(island: Island) {
        const currentCeil = island.getLevelCeil();
        let perksChanged = false;
        for (const perk of Object.values(this.perks)) {
            if (island.hasPerk(perk.id)) continue;

            if (currentCeil >= perk.level) {
                await island.addPerk(perk.id);
                perksChanged = true;
            }
        }
        if (perksChanged) {
            const onlineOwners = island.getOnlineOwners();
            for (const owner of onlineOwners) {
                this.applyPermissions(owner, island);
            }
        }
    }
}

export { IslandPerkUnlocks }