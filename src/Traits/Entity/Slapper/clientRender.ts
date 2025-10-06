import { Entity, EntityTrait, Player } from "@serenityjs/core";
import { ByteTag, StringTag } from "@serenityjs/nbt";
import { ActorDataId, ActorDataType, AddEntityPacket, DataItem } from "@serenityjs/protocol";
import { Utils } from "../../../Utils";

enum ClientRenderPreset {
    Stats = "Stats"
}

const ClientRenderBehavior: { [key in ClientRenderPreset]: (player: Player, metadata: Array<DataItem>) => Array<DataItem> } = {
    [ClientRenderPreset.Stats]: (player, metadata) => {
        const text = `§e======= §lYour Stats§r§e =======\n§bName: §f${player.username}\n§aRank: §f${player.getPrimaryRank().displayName}§r\n§6Balance: §f$${Utils.formatInt(player.getMoney())}\n§cXP: §f${player.getXp()}\n§dTime Played: §f${Utils.formatDuration(player.getTimePlayed())}\n§bBlocks Mined: §f${player.getCriteria("blocksMined")}\n§aBlocks Placed: §f${player.getCriteria("blocksPlaced")}\n§eCrops Farmed: §f${player.getCriteria("cropsFarmed")}\n§4Mobs Slain: §f${player.getCriteria("mobsSlayed")}\n§cKills: §f${player.getCriteria("kills")}\n§9Deaths: §f${player.getCriteria("deaths")}\n\n`
        const name = metadata.find((x) => x.identifier === ActorDataId.Name);
        if (!name) {
            metadata.push(new DataItem(ActorDataId.Name, ActorDataType.String, text));
        } else {
            name.value = text;
        }
        return metadata;
    }
}

class EntityClientRenderTrait extends EntityTrait {
    public static readonly identifier = "client-render";
    public static readonly types = [];
    public constructor(entity: Entity, preset?: keyof typeof ClientRenderPreset) {
        super(entity);
        this.entity.setStorageEntry("Persistent", new ByteTag(0, "Persistent"));
        this.entity.metadata.setActorMetadata(ActorDataId.NametagAlwaysShow, ActorDataType.Byte, 1);
        if (preset) {
            this.entity.setStorageEntry("ClientRenderPreset", new StringTag(preset, "ClientRenderPreset"));
        }
    }

    public async sendPacketData(player: Player) {
        const preset = this.entity.getStorageEntry<StringTag>("ClientRenderPreset")?.valueOf() as ClientRenderPreset;
        if (!preset || !(preset in ClientRenderBehavior)) return;

        //@ts-ignore
        const packet = new AddEntityPacket();

        // Set the packet properties
        packet.uniqueEntityId = this.entity.uniqueId;
        packet.runtimeId = this.entity.runtimeId;
        packet.identifier = this.entity.type.identifier;
        packet.position = this.entity.position;
        packet.velocity = this.entity.velocity;
        packet.pitch = this.entity.rotation.pitch;
        packet.yaw = this.entity.rotation.yaw;
        packet.headYaw = this.entity.rotation.headYaw;
        packet.bodyYaw = this.entity.rotation.yaw;
        packet.attributes = [];
        packet.data = ClientRenderBehavior[preset](player, this.entity.metadata.getAllActorMetadataAsDataItems());
        packet.properties = this.entity.sharedProperties.getSharedPropertiesAsSyncData();
        packet.links = [];

        player.send(packet);
    }
}

export { EntityClientRenderTrait }