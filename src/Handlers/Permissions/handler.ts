import { EntityHitSignal, PlayerBreakBlockSignal, PlayerContainerInteractionSignal, PlayerInteractWithBlockSignal, PlayerPlaceBlockSignal } from "@serenityjs/core";

const MessageCooldown = new Map<string, number>()

class PermissionsHandler {
    public static onBreak({ player }: PlayerBreakBlockSignal) {
        if (!player.isWorldIsland()) {
            player.error("You do not have permission to break blocks here.")
            return false
        }
        const island = player.getIsland()
        if (!island || !island.isMember(player.xuid)) {
            player.error("You must be a member of this island to break blocks.")
            return false
        }
        return true
    }

    public static onPlace({ player }: PlayerPlaceBlockSignal) {
        if (!player.isWorldIsland()) {
            player.error("You do not have permission to place blocks here.")
            return false
        }
        const island = player.getIsland()
        if (!island || !island.isMember(player.xuid)) {
            player.error("You must be a member of this island to place blocks.")
            return false
        }
        return true
    }

    public static onInteract({ source }: PlayerInteractWithBlockSignal) {
        if (!source.isWorldIsland()) {
            if (!MessageCooldown.has(source.xuid) || MessageCooldown.get(source.xuid)! < Date.now()) {
                source.error("You do not have permission to interact here.")
                MessageCooldown.set(source.xuid, Date.now() + 100)
            }
            return false
        }
        const island = source.getIsland()
        if (!island || !island.isMember(source.xuid)) {
            if (!MessageCooldown.has(source.xuid) || MessageCooldown.get(source.xuid)! < Date.now()) {
                source.error("You must be a member of this island to interact.")
                MessageCooldown.set(source.xuid, Date.now() + 100)
            }
            return false
        }
        return true
    }

    public static onUseContainer({ player }: PlayerContainerInteractionSignal) {
        if (!player.isWorldIsland()) {
            player.error("You do not have permission to use containers here.")
            return false
        }
        const island = player.getIsland()
        if (!island || !island.hasPermission(player.xuid, "admin")) {
            player.error("You must be an admin of this island to use containers.")
            return false
        }
        return true
    }

    public static onEntityHit({ damagingEntity, hitEntity }: EntityHitSignal) {
        if (!damagingEntity?.isPlayer() || hitEntity.isPlayer()) return false
        if (!damagingEntity.isWorldIsland()) {
            damagingEntity.error("You do not have permission to attack here.")
            return false
        }
        const island = damagingEntity.getIsland()
        if (!island || !island.isMember(damagingEntity.xuid)) {
            damagingEntity.error("You must be a member of this island to attack.")
            return false
        }
        return true
    }
}

export { PermissionsHandler }