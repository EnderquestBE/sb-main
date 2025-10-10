import { EntityIdentifier, Player, PlayerTrait, TraitOnTickDetails } from "@serenityjs/core";
import { Vector3f } from "@serenityjs/protocol";
import { Warp } from "../../../Classes";
class PlayerBoundaryTrait extends PlayerTrait {
    public static readonly identifier = "boundary";
    public static readonly types = [EntityIdentifier.Player];

    public onTick({ currentTick }: TraitOnTickDetails): void {
        if (currentTick % 5n !== 0n) return;
        // Void save.
        const elevation = this.player.position.y
        if (elevation < -18) {
            if (this.player.isWorldIsland()) {
                const island = this.player.getWorldIsland()
                if (island) {
                    if (!island.teleport(this.player)) {
                        Warp.to(this.player, "SPAWN");
                        return;
                    }
                    this.player.info(
                        `§eYou have been teleported to island §a${island.getName()}§e's spawn!`
                    );
                }
            } else Warp.to(this.player, "SPAWN");
        }
        // Boundary behavior.
        if (!this.player.isWorldIsland()) return;
        const island = this.player.getWorldIsland();

        if (!island || island.isInBounds(this.player.position)) return;

        if (elevation > island.getHeight() || elevation < 0) return

        const direction = new Vector3f(-this.player.position.x, 0, -this.player.position.z).normalize();
        const pushbackForce = 0.4;
        this.player.applyImpulse(new Vector3f(direction.x * pushbackForce, this.player.onGround ? pushbackForce : 0.1, direction.z * pushbackForce));
        this.player.error("You've reached the island boundary! Expand your island with §d/is expand §cto continue ahead!")
    }
}

export { PlayerBoundaryTrait };