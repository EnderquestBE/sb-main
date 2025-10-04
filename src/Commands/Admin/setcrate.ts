import { CustomEnum, Player } from "@serenityjs/core";
import {
    CommandBuilder,
    CommandOverload
} from "../../Classes";
import { CrateIdentifier } from "../../Types/types";
import { StringTag } from "@serenityjs/nbt";

// Enum for the Crate types
class CrateTypeEnum extends CustomEnum {
    public static readonly identifier = "CrateTypeEnum";
    public static options = Object.values(CrateIdentifier);
}

new CommandBuilder("setcrate", "Creates a crate at your location.")
    .setPermissions(["serenity.operator"])
    .addOverload(
        new CommandOverload({
            type: CrateTypeEnum
        }).onCallback((player, { type }) => {
            if (!(player instanceof Player)) return;

            const CrateType = type.result as keyof typeof CrateIdentifier;
            if (!CrateType) {
                return player.error("Crate type is invalid.");
            }

            // Set crate NBT.
            const dimension = player.dimension;
            const block = dimension.getBlock({ x: player.position.x, y: player.position.y - 1, z: player.position.z });
            block.setStorageEntry("Crate", new StringTag(CrateType, "Crate"));

            player.info(`§bBlock at §e${block.position.x} ${block.position.y} ${block.position.z} §bhas been defined as a §6${CrateType}§b crate.`);
        })
    )
    .register("Admin");
