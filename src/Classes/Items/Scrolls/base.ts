import { ItemIdentifier, ItemStack } from "@serenityjs/core";
import { StringTag } from "@serenityjs/nbt";
import { ScrollIdentifier } from "../../../Types/types";

abstract class Scroll extends ItemStack {
    public static readonly identifier: ItemIdentifier;
    public static readonly scrollType: ScrollIdentifier;

    constructor(identifier: ItemIdentifier, scrollType: ScrollIdentifier, name: string, lore: string[]) {
        super(identifier);
        this.setDisplayName(`§r§l§d${name}`);
        this.setLore(lore);
        this.nbt.set("Scroll", new StringTag(scrollType.toString(), "Scroll"));
    }
}

export { Scroll };