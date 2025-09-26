import { ItemIdentifier, ItemStack } from "@serenityjs/core";
import { StashIdentifier } from "../../../Types/Stashes/identifier";
import { StringTag } from "@serenityjs/nbt";

abstract class StashItem extends ItemStack {
    public static readonly identifier: ItemIdentifier;
    public static readonly StashType: StashIdentifier;

    constructor(identifier: ItemIdentifier, StashType: StashIdentifier, name: string) {
        super(identifier);
        this.setDisplayName(`§r§l${name}§r §6Stash`);
        this.setLore(["§r§7Use to open!"]);
        this.nbt.set("Stash", new StringTag(StashType.toString(), "Stash"));
    }
}

export { StashItem };