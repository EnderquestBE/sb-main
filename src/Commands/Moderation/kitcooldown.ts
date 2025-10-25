import { CustomEnum, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload, PlayerEnum } from "../../Classes";
import { Kit, KitData } from "../../Configuration/Kit";
import { CompoundTag } from "@serenityjs/nbt";

class KitCooldownEnum extends CustomEnum {
    public static readonly identifier = "kitCooldown";
    public static options = [...Kit.keys, "resetall"];
}

function resetKitCooldown(target: Player, player: Player, kitId: string, kitData: KitData) {
    const kitEntries = target.getStorageEntry<CompoundTag>("KitCooldown");
    if (!kitEntries || !kitEntries.get(kitId)) {
        player.error("Player has not used this kit yet.");
        return;
    }
    kitEntries.delete(kitId);
    target.setStorageEntry("KitCooldown", kitEntries);
    player.info(`§a${target.username}§b's cooldown for §a${kitData.name} §bhas been reset.`);
}

new CommandBuilder("kitcooldown", "Resets cooldown for a specified kit for a player.")
    .setPermissions(["mod.kitcooldown"])
    .addOverload(new CommandOverload({
        player: PlayerEnum,
        kit: KitCooldownEnum
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
        if (kitId === "resetall") {
            for (const kit of Kit.getAll()) {
                resetKitCooldown(target, player, kit.id, kit);
            }
        } else {
            const kitData = Kit.get(kitId);
            if (!kitData) {
                player.error("Kit does not exist.");
                return;
            }
            resetKitCooldown(target, player, kitId, kitData);
        }
    }))
    .register("Moderation");