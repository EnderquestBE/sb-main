import { ItemIdentifier, ItemStack } from "@serenityjs/core";
import { Kit } from "../../Configuration/Kit";
import { StringTag } from "@serenityjs/nbt";
import { ItemKitTrait } from "../../Traits/Item/traits";

class KitItem extends ItemStack {
    constructor(identifier: string) {
        super(ItemIdentifier.Chest);
        const trait = this.getTrait(ItemKitTrait) ?? this.addTrait(ItemKitTrait);

        const data = Kit.get(identifier);
        if (!data) throw new Error(`Kit with identifier ${identifier} does not exist.`);
        const { id, displayName } = data;

        this.setDisplayName(`§r§l${displayName} §bKit§r`);
        this.setLore(["§r§7Place to receive contents!"]);
        this.nbt.set("Kit", new StringTag(id, "Kit"));
    }
}

export { KitItem }