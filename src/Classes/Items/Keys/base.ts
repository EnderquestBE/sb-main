import { ItemIdentifier, ItemStack } from "@serenityjs/core";
import { ByteTag, StringTag } from "@serenityjs/nbt";
import { CrateIdentifier } from "../../../Types/types";

abstract class CrateKey extends ItemStack {
    public static readonly identifier: ItemIdentifier;
    public static readonly crateType: CrateIdentifier;

    constructor(identifier: ItemIdentifier, crateType: CrateIdentifier, name: string) {
        super(identifier);
        this.setDisplayName(`§r${name} Key§r`);
        this.setLore([`§r§7Use on a crate at §6/crates§7!`]);
        this.nbt.set("Crate", new StringTag(crateType.toString(), "Crate"));
        this.getStorage().set("bypassInteract", new ByteTag(1, "bypassInteract"));
    }
}

export { CrateKey };