import {
    BlockIdentifier,
    BlockPermutation,
    BlockTrait,
} from "@serenityjs/core";
import { BlockActorDataPacket, UpdateBlockFlagsType, UpdateBlockLayerType, UpdateBlockPacket } from "@serenityjs/protocol";
class BlockTileEntityUpdateTrait extends BlockTrait {
    public static readonly identifier: string = "tile_entity_update";
    public static readonly types: Array<BlockIdentifier> = [
        BlockIdentifier.Chest,
        BlockIdentifier.WallSign,
        BlockIdentifier.StandingSign,
        BlockIdentifier.MobSpawner
    ];

    public static readonly datatypes: Set<BlockIdentifier> = new Set([
        BlockIdentifier.WallSign,
        BlockIdentifier.StandingSign,
        BlockIdentifier.MobSpawner
    ]);

    public updateTileEntity() {
        const packets = [];

        const packet = new UpdateBlockPacket();

        packet.networkBlockId = BlockPermutation.resolve(BlockIdentifier.Air).networkId;
        packet.position = this.block.position;
        packet.flags = UpdateBlockFlagsType.Network;
        packet.layer = UpdateBlockLayerType.Normal;
        packets.push(packet);

        const packet2 = new UpdateBlockPacket();

        packet2.networkBlockId = this.block.permutation.networkId;
        packet2.position = this.block.position;
        packet2.flags = UpdateBlockFlagsType.Network;
        packet2.layer = UpdateBlockLayerType.Normal;
        packets.push(packet, packet2);

        if (BlockTileEntityUpdateTrait.datatypes.has(this.block.identifier as BlockIdentifier)) {
            const packet3 = new BlockActorDataPacket();
            packet3.position = this.block.position;
            packet3.nbt = this.block.getStorage();
            packets.push(packet3);
        }

        return packets;
    }
}

export { BlockTileEntityUpdateTrait };