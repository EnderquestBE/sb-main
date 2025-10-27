import {
    BlockIdentifier,
    BlockPermutation,
    ItemIdentifier,
    ItemStack,
    ItemStackTrait,
    ItemStackUseOnBlockOptions,
    Player
} from "@serenityjs/core";
import { BlockPosition, LevelSoundEvent, LevelSoundEventPacket } from "@serenityjs/protocol";

const PlacementCooldown = new Map<string, number>();

class BlockNoInteractTrait extends ItemStackTrait {
    public static readonly identifier: string = "bypass_placement";
    public static readonly types: Array<ItemIdentifier> = [
        ItemIdentifier.WoodenPressurePlate
    ];

    public block: BlockPermutation;

    constructor(item: ItemStack) {
        super(item);
        switch (item.identifier) {
            case ItemIdentifier.WoodenPressurePlate:
                this.block = BlockPermutation.resolve(BlockIdentifier.WoodenPressurePlate);
                break;
            default:
                this.block = BlockPermutation.resolve(BlockIdentifier.Air);
                break;
        }
    }

    public onUseOnBlock(player: Player, { targetBlock, face, placingBlock }: ItemStackUseOnBlockOptions): boolean | void {
        if (placingBlock) return;
        if (PlacementCooldown.has(player.xuid)) {
            if (PlacementCooldown.get(player.xuid)! > Date.now()) {
                return false;
            }
        }
        PlacementCooldown.set(player.xuid, Date.now() + 100);
        const block = targetBlock.face(face);
        if (block.type.identifier === BlockIdentifier.Air) {
            // Set the block.
            block.setPermutation(this.block);

            // Play block sound.
            // Create a new LevelSoundEventPacket to play the block place sound
            const sound = new LevelSoundEventPacket();
            sound.event = LevelSoundEvent.Place;
            sound.position = BlockPosition.toVector3f(block.position);
            sound.data = block.permutation.networkId;
            sound.actorIdentifier = String();
            sound.isBabyMob = false;
            sound.isGlobal = false;
            sound.uniqueActorId = -1n;

            player.dimension.broadcast(sound);

            // Decrement item stack.
            if (this.item.stackSize > 1) {
                this.item.decrementStack();
            } else {
                this.item.container?.clearSlot(this.item.slot)
            }
        }
        return true;
    }
}

export { BlockNoInteractTrait };