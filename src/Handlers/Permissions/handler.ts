import { BlockIdentifier, EntityHitSignal, PlayerBreakBlockSignal, PlayerInteractWithBlockSignal, PlayerOpenedContainerSignal, PlayerPlaceBlockSignal } from "@serenityjs/core";
import { Vector3f } from "@serenityjs/protocol";
import { EnchantmentHandler } from "../Enchantment/handler";

const MessageCooldown = new Map<string, number>()

class PermissionsHandler {

    private static readonly PLACEMENT_BLACKLIST: Set<BlockIdentifier> = new Set([
        BlockIdentifier.IronOre,
        BlockIdentifier.GoldOre,
        BlockIdentifier.Pumpkin,
        BlockIdentifier.MelonBlock
    ])

    public static onBreak({ player, block, itemStack }: PlayerBreakBlockSignal) {
        if (!player.isWorldIsland()) {
            player.error("You do not have permission to break blocks here.")
            return false
        }
        const island = player.getWorldIsland();
        if (!island || !island.isMember(player.xuid)) {
            player.error("You must be a member of this island to break blocks.")
            return false
        }

        if (!island.isInBounds(block.position as Vector3f)) {
            player.error("You've reached the island boundary! Expand your island with §d/is expand §cto continue ahead!")
            return false
        }
        // Handle custom enchantments on block break.
        EnchantmentHandler.onBlockBreak(player, itemStack, block);
        return true
    }

    public static onPlace({ player, permutationBeingPlaced, block }: PlayerPlaceBlockSignal) {
        if (this.PLACEMENT_BLACKLIST.has(permutationBeingPlaced.type.identifier)) {
            player.error("This block cannot be placed.")
            return false
        }
        if (!player.isWorldIsland()) {
            player.error("You do not have permission to place blocks here.")
            return false
        }
        const island = player.getWorldIsland();
        if (!island || !island.isMember(player.xuid)) {
            player.error("You must be a member of this island to place blocks.")
            return false
        }

        if (!island.isInBounds(block.position as Vector3f)) {
            player.error("You've reached the island boundary! Expand your island with §d/is expand §cto continue ahead!")
            return false
        }

        return true
    }

    public static onInteract({ source, block, placingBlock }: PlayerInteractWithBlockSignal) {
        if (placingBlock) return true
        if (!source.isWorldIsland()) {
            if (!MessageCooldown.has(source.xuid) || MessageCooldown.get(source.xuid)! < Date.now()) {
                source.error("You do not have permission to interact here.")
                MessageCooldown.set(source.xuid, Date.now() + 100)
            }
            return false
        }
        const island = source.getWorldIsland();
        if (!island || !island.isMember(source.xuid)) {
            if (!MessageCooldown.has(source.xuid) || MessageCooldown.get(source.xuid)! < Date.now()) {
                source.error("You must be a member of this island to interact.")
                MessageCooldown.set(source.xuid, Date.now() + 100)
            }
            return false
        }

        if (!island.isInBounds(block.position as Vector3f)) {
            source.error("You've reached the island boundary! Expand your island with §d/is expand §cto continue ahead!")
            return false
        }

        return true
    }

    public static onContainerOpen({ player }: PlayerOpenedContainerSignal) {
        if (!player) return false;
        if (!player.isWorldIsland()) {
            player.error("You do not have permission to use containers here.");
            return false;
        }
        const island = player.getWorldIsland();
        if (!island || !island.hasPermission(player.xuid, "admin")) {
            player.error("You must be an admin of this island to use containers.");
            return false;
        }
        return true;
    }

    public static onEntityHit({ damagingEntity, hitEntity }: EntityHitSignal) {
        if (!damagingEntity?.isPlayer() || hitEntity.isPlayer()) return false
        if (!damagingEntity.isWorldIsland()) {
            damagingEntity.error("You do not have permission to attack here.")
            return false
        }
        const island = damagingEntity.getWorldIsland();
        if (!island || !island.isMember(damagingEntity.xuid)) {
            damagingEntity.error("You must be a member of this island to attack.")
            return false
        }

        if (!island.isInBounds(hitEntity.position as Vector3f)) {
            damagingEntity.error("You've reached the island boundary! Expand your island with §d/is expand §cto continue ahead!")
            return false
        }
        return true
    }
}

export { PermissionsHandler }