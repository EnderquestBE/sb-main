import { Player } from "@serenityjs/core";
import { Rotation, SerializedSkin, Vector3f } from "@serenityjs/protocol";
import { CustomSkin, CustomSkinOptions } from "../Skin";

type SlapperInfo = {
    identifier: string; // Identifier to register as a new entity type.
    name: string; // Name to use for nametag.
    position: Vector3f; // Position to spawn the slapper at.
    function: (player: Player) => void; // Function to execute when the slapper is used.
    texture: string; // Name of skin image.
    rotation?: Rotation; // The rotation of the slapper entity.
    skinOptions?: Partial<CustomSkinOptions>; // Additional skin options.
    skin?: SerializedSkin; // Constructed result skin.
}

class Slapper {
    private static slappers: Map<string, SlapperInfo> = new Map();

    public static async registerSlapper(slapper: SlapperInfo) {
        slapper.skin = await (await CustomSkin.from(slapper.identifier, slapper.texture, { ...slapper.skinOptions })).toSerializedSkin();
        this.slappers.set(slapper.identifier, slapper);
    }

    public static getAll() {
        return Array.from(this.slappers.values());
    }

    public static get(identifier: string) {
        return this.slappers.get(identifier);
    }
}

export { Slapper, SlapperInfo };