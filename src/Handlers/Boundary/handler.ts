import { Player, WorldTickSignal } from "@serenityjs/core";
import { Vector3f } from "@serenityjs/protocol";
import { Warp } from "../../Classes/Warp/warp";
import { WarpLocation } from "../../Configuration/Warp/warpLocation";

class BoundaryHandler {

    public static runtime({ currentTick, world }: WorldTickSignal) {
        if (Number(currentTick) % 5 !== 0) return
        for (const player of world.getPlayers()) {
            this.check(player)
        }
    }

    public static check(player: Player) {
        // Void save.
        const elevation = player.position.y
        if (elevation < -48) {
            if (player.isWorldIsland()) {
                const island = player.getWorldIsland()
                if (island) {
                    island.teleport(player)
                    player.info(
                        `§eYou have been teleported to island §a${island.getName()}§e's spawn!`
                    );
                }
            } else Warp.to(player, WarpLocation.SPAWN)
        }
        // Boundary behavior.
        if (!player.isWorldIsland()) return;
        const island = player.getWorldIsland();

        if (!island || island.isInBounds(player.position)) return;

        if (elevation > island.getHeight() || elevation < 0) return

        const direction = new Vector3f(-player.position.x, 0, -player.position.z).normalize();
        const pushbackForce = 0.5;
        player.applyImpulse(new Vector3f(direction.x * pushbackForce, pushbackForce, direction.z * pushbackForce));
        player.error("You've reached the island boundary! Expand your island with §d/is expand §cto continue ahead!")
    }
}

export { BoundaryHandler };