import { Entity, EntityInteractMethod, EntityTrait, Player } from "@serenityjs/core";
import { Slapper, SlapperInfo } from "../../../Classes";
import { ByteTag } from "@serenityjs/nbt";
import { AddPlayerPacket, Color, CommandPermissionLevel, Gamemode, NetworkItemStackDescriptor, PermissionLevel, PlayerListAction, PlayerListPacket, SkinImage } from "@serenityjs/protocol";
import { v4 as uuid } from 'uuid';
import { ServerTaskHandler } from "../../../Handlers/Server/handler";

class EntitySlapperTrait extends EntityTrait {
    public static readonly identifier = "slapper";
    public static readonly types = Slapper.getAll().map(s => s.identifier) as any[];

    private readonly info: SlapperInfo;

    public constructor(entity: Entity) {
        super(entity);
        // Set non-save.
        this.entity.setStorageEntry("Persistent", new ByteTag(0, "Persistent"))
        const info = Slapper.get(this.entity.identifier);
        if (!info) throw new Error(`Slapper info not found for identifier ${this.entity.identifier}`);
        this.info = info;
        // Entity properties.
        this.entity.scale = 1.5;
        this.entity.setNametag(info.name + "\n§r§dTAP TO USE§r");
        this.entity.setNametagAlwaysVisible(true);
    }

    public async sendPacketData(player: Player) {
        //@ts-ignore
        const entityUuid = uuid();
        const skin = (this.info.skin ? this.info.skin : player.skin.getSerialized());

        const listPacket = new PlayerListPacket();
        listPacket.action = PlayerListAction.Add;
        listPacket.records = [{
            uniqueId: this.entity.uniqueId,
            uuid: entityUuid,
            xuid: "1",
            username: "NPC",
            skin: skin,
            platformBuild: null,
            platformChatIdentifier: "",
            isHost: false,
            isVisitor: false,
            isTeacher: false,
            locatorColor: new Color(0, 0, 0, 0)
        }]

        player.send(listPacket)

        const playerPacket = new AddPlayerPacket();
        playerPacket.uuid = entityUuid;
        playerPacket.username = "NPC";
        playerPacket.runtimeId = this.entity.runtimeId;
        playerPacket.platformChatId = String();
        playerPacket.position = this.entity.position;
        playerPacket.velocity = this.entity.velocity;
        playerPacket.pitch = this.entity.rotation.pitch;
        playerPacket.yaw = this.entity.rotation.yaw;
        playerPacket.headYaw = this.entity.rotation.headYaw;
        playerPacket.heldItem = new NetworkItemStackDescriptor(0);
        playerPacket.gamemode = Gamemode.Creative;
        playerPacket.data = this.entity.metadata.getAllActorMetadataAsDataItems();
        playerPacket.properties = this.entity.sharedProperties.getSharedPropertiesAsSyncData();
        playerPacket.uniqueEntityId = this.entity.uniqueId;
        playerPacket.premissionLevel = PermissionLevel.Member;
        playerPacket.commandPermission = CommandPermissionLevel.Normal;
        playerPacket.abilities = [];
        playerPacket.links = [];
        playerPacket.deviceId = "";
        playerPacket.deviceOS = 0;

        player.send(playerPacket)

        ServerTaskHandler.queueTask(() => {
            const list2 = new PlayerListPacket();
            list2.action = PlayerListAction.Remove;
            list2.records = [{
                uniqueId: this.entity.uniqueId,
                uuid: entityUuid,
                xuid: "1",
                username: "NPC",
                skin: skin,
                platformBuild: null,
                platformChatIdentifier: "",
                isHost: false,
                isVisitor: false,
                isTeacher: false,
                locatorColor: new Color(0, 0, 0, 0)
            }]

            player.send(list2)
        }, 250)
    }

    public onInteract(player: Player): void {
        this.info.function(player);
    }

    public slapperInteract(player: Player) {
        this.info.function(player);
    }
}

export { EntitySlapperTrait }