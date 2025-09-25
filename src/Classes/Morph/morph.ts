import { PlayerSkinPacket, SerializedSkin } from "@serenityjs/protocol";
import { CustomSkin, CustomSkinOptions } from "../Skin";
import { Player } from "@serenityjs/core";

type Morph = {
    identifier: string; // Identifier for the morph.
    skinURL: string; // URL to the skin image.
    skinOptions?: Partial<CustomSkinOptions>; // Additional skin options.
    skin?: SerializedSkin; // Constructed result skin.
}

class MorphManager {
    private static morphs: Map<string, Morph> = new Map();

    public static async registerMorph(morph: Morph) {
        morph.skin = await (await CustomSkin.from(morph.identifier, morph.skinURL, { ...morph.skinOptions })).toSerializedSkin();
        this.morphs.set(morph.identifier, morph);
    }

    public static morph(player: Player, morphId: string) {
        const morphData = MorphManager.get(morphId);
        if (!morphData) {
            player.error("The specified morph does not exist.");
            return;
        }

        //@ts-ignore
        player.skin = morphData.skin!;

        // Apply the morph
        const packet = new PlayerSkinPacket()
        packet.uuid = player.uuid;
        packet.skin = morphData.skin!;
        packet.skinName = morphData.identifier;
        packet.oldSkinName = player.skin.identifier;
        packet.isVerified = true;
        player.world.broadcast(packet)
    }

    public static getAll() {
        return Array.from(this.morphs.values());
    }

    public static get(identifier: string) {
        return this.morphs.get(identifier);
    }
}

export { MorphManager, Morph };