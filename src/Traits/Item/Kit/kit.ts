import {
    ItemStackTrait,
    BlockIdentifier,
    Player,
    ItemStackUseOnBlockOptions,
    BlockChestTrait,
} from "@serenityjs/core";
import { ServerTaskHandler } from "../../../Handlers";
import { StringTag } from "@serenityjs/nbt";
import { Kit } from "../../../Configuration/Kit";

class ItemKitTrait extends ItemStackTrait {
    public static readonly identifier = "kit";

    public onUseOnBlock(_player: Player, { targetBlock: block, face }: ItemStackUseOnBlockOptions): void {
        const kitId = this.item.nbt.get<StringTag>("Kit")?.valueOf();
        if (!kitId) return;
        const data = Kit.get(kitId);
        if (!data) return;
        ServerTaskHandler.queueTask(() => {
            block = block.face(face)
            if (block.type.identifier !== BlockIdentifier.Chest) return
            const trait = block.getTrait(BlockChestTrait) ?? block.addTrait(BlockChestTrait)
            data.onPlace(block, trait.container)
        }, 5);
    }
}

export { ItemKitTrait };