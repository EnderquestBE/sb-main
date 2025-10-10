import { BlockIdentifier, EntityTrait, TraitOnTickDetails } from "@serenityjs/core";
import { ActorFlag } from "@serenityjs/protocol";
import { SpawnerEntity } from "../../../Handlers";
import { EntityStackTrait } from "../traits";

const FIRE_BLOCKS = new Set<string>([
    BlockIdentifier.Fire,
    BlockIdentifier.Lava,
    BlockIdentifier.FlowingLava,
]);

class EntityFlammableTrait extends EntityTrait {
    public static readonly identifier = "flammable";
    public static readonly types = SpawnerEntity.keys;

    public fireTicks: number = 0;

    public isOnFire(): boolean {
        return this.fireTicks > 0;
    }

    public setOnFire(seconds: number) {
        this.fireTicks = seconds * 20;
        this.entity.flags.setActorFlag(ActorFlag.OnFire, true);
    }

    public extinguish() {
        this.fireTicks = 0;
        this.entity.flags.setActorFlag(ActorFlag.OnFire, false);
    }

    public SPAWNER_INFO = SpawnerEntity.get(this.entity.identifier);

    public onTick({ currentTick }: TraitOnTickDetails) {
        if (currentTick % 25n !== 0n) return;
        if (this.fireTicks > 0) {
            this.fireTicks = Math.max(0, this.fireTicks - 25);
            const trait = this.entity.getTrait(EntityStackTrait)
            if (trait) trait.onDamage(undefined, 4);
        } else {
            this.extinguish();
        }
        if (this.SPAWNER_INFO) {
            let i = this.SPAWNER_INFO.height;
            while (i > 0) {
                const block = this.dimension.getBlock({ x: this.entity.position.x, y: this.entity.position.y + i--, z: this.entity.position.z });
                if (FIRE_BLOCKS.has(block.identifier)) {
                    this.setOnFire(5);
                    break;
                }
            }
        }
    }
}

export { EntityFlammableTrait }