import { EntityIdentifier, EntityTrait, Player, TraitOnTickDetails } from "@serenityjs/core";
import { Vector3f } from "@serenityjs/protocol";
import { Warp } from "../../../Classes";
class PlayerBoundaryTrait extends EntityTrait {
    public static readonly identifier = "persistence";
    public static readonly types = [EntityIdentifier.Player];

    declare public readonly entity: Player;

    public onTick({ currentTick }: TraitOnTickDetails): void {
        if (currentTick % 20n !== 0n) return;
        // Void save.
        const elevation = this.entity.position.y
        if (elevation < -48) {
            if (this.entity.isWorldIsland()) {
                const island = this.entity.getWorldIsland()
                if (island) {
                    island.teleport(this.entity)
                    this.entity.info(
                        `§eYou have been teleported to island §a${island.getName()}§e's spawn!`
                    );
                }
            } else Warp.to(this.entity, "SPAWN");
        }
        // Boundary behavior.
        if (!this.entity.isWorldIsland()) return;
        const island = this.entity.getWorldIsland();

        if (!island || island.isInBounds(this.entity.position)) return;

        if (elevation > island.getHeight() || elevation < 0) return

        const direction = new Vector3f(-this.entity.position.x, 0, -this.entity.position.z).normalize();
        const pushbackForce = 0.5;
        this.entity.applyImpulse(new Vector3f(direction.x * pushbackForce, pushbackForce, direction.z * pushbackForce));
        this.entity.error("You've reached the island boundary! Expand your island with §d/is expand §cto continue ahead!")
    }
}

export { PlayerBoundaryTrait };