import { CustomEnum, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload, PlayerEnum } from "../../Classes";
import { Kit } from "../../Configuration/Kit";
import { CompoundTag } from "@serenityjs/nbt";

class KitEnum extends CustomEnum {
    public static readonly identifier = "kit";
    public static options = Kit.keys;
}

new CommandBuilder("kitcooldown", "Resets cooldown for a specified kit for a player.")
    .setPermissions(["mod.kitcooldown"])
    .addOverload(new CommandOverload({
        player: PlayerEnum,
        kit: KitEnum
    }).onCallback((player, { player: targetRaw, kit: kitRaw }) => {
        if (!(player instanceof Player)) return;
        const targetName = targetRaw.result as string;
        if (!targetName) return;
        const target = player.world.serenity.getPlayerByUsername(targetName);
        if (!target) {
            player.error("Player is offline or does not exist.");
            return;
        }
        const kitId = kitRaw.result as string;
        if (!kitId) return;
        const kitData = Kit.get(kitId);
        if (!kitData) {
            player.error("Kit does not exist.");
            return;
        }
        const kitEntries = target.getStorageEntry<CompoundTag>("KitCooldown");
        if (!kitEntries || !kitEntries.get(kitId)) {
            player.error("Player has not used this kit yet.");
            return;
        }
        kitEntries.delete(kitId);
        target.setStorageEntry("KitCooldown", kitEntries);
        player.info(`§a${target.username}§b's cooldown for §a${kitData.name} §bhas been reset.`);
    }))
    .register("Moderation");