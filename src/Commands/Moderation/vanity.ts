import { Player, IntegerEnum, CustomEnum } from "@serenityjs/core";
import { CommandBuilder, CommandOverload, PlayerEnum, VanityEnum } from "../../Classes";
import { Server } from "../../server";

class VanityActionEnum extends CustomEnum {
    public static readonly identifier = "vanityAction"
    public static options = ["unlock", "revoke"]
}

class VanitySetEnum extends CustomEnum {
    public static readonly identifier = "vanitySet"
    public static options = ["set"]
}

class VanityClearEnum extends CustomEnum {
    public static readonly identifier = "vanityClear"
    public static options = ["clear"]
}

class VanityUnlockAllEnum extends CustomEnum {
    public static readonly identifier = "vanityUnlockAll"
    public static options = ["unlockAll"]
}


new CommandBuilder("vanity", "Manages player vanities.")
    .setPermissions(["mod.vanity"])
    .addOverload(new CommandOverload({
        clear: VanityClearEnum,
        player: PlayerEnum,
        slot: IntegerEnum
    }).onCallback((player, { player: playerRaw, slot: slotRaw }) => {
        if (!(player instanceof Player)) return;
        const targetName = playerRaw.result as string;
        const target = Server.instance.getPlayerByUsername(targetName);
        if (!target) {
            player.error(`Player ${targetName} is offline or does not exist.`);
            return;
        }
        const slot = slotRaw.result as number;
        if (slot < 1 || slot > 3) {
            player.error(`Invalid slot (1-3).`);
            return;
        }
        target.unequipVanity(slot as 1 | 2 | 3);
        player.info(`§aSuccessfully cleared vanity in slot §c${slot}§a for §e${target.username}§a.`);
    }))
    .addOverload(new CommandOverload({
        set: VanitySetEnum,
        player: PlayerEnum,
        slot: IntegerEnum,
        vanityId: VanityEnum
    }).onCallback((player, { player: playerRaw, slot: slotRaw, vanityId: vanityRaw }) => {
        if (!(player instanceof Player)) return;
        const targetName = playerRaw.result as string;
        const target = Server.instance.getPlayerByUsername(targetName);
        if (!target) {
            player.error(`Player ${targetName} is offline or does not exist.`);
            return;
        }
        const slot = slotRaw.result as number;
        if (slot < 1 || slot > 3) {
            player.error(`Invalid slot (1-3).`);
            return;
        }
        const vanityId = vanityRaw.result as string;
        target.equipVanity(slot as 1 | 2 | 3, vanityId);
        player.info(`§aSuccessfully set vanity §b${vanityId}§a in slot §c${slot}§a for §e${target.username}§a.`);
    }))
    .addOverload(new CommandOverload({
        unlockAll: VanityUnlockAllEnum,
        player: PlayerEnum
    }).onCallback((player, { player: playerRaw }) => {
        if (!(player instanceof Player)) return;
        const targetName = playerRaw.result as string;
        const target = Server.instance.getPlayerByUsername(targetName);
        if (!target) {
            player.error(`Player ${targetName} is offline or does not exist.`);
            return;
        }
        target.unlockAllVanity();
        player.info(`§aSuccessfully unlocked all vanities for §e${target.username}§a.`);
    }))
    .addOverload(new CommandOverload({
        action: VanityActionEnum,
        player: PlayerEnum,
        vanityId: VanityEnum
    }).onCallback((player, { action, player: playerRaw, vanityId: vanityRaw }) => {
        if (!(player instanceof Player)) return;
        const targetName = playerRaw.result as string;
        const target = Server.instance.getPlayerByUsername(targetName);
        if (!target) {
            player.error(`Player ${targetName} is offline or does not exist.`);
            return;
        }
        const actionType = action.result as string;

        if (actionType === "unlock") {
            const vanityId = vanityRaw.result as string;
            target.unlockVanity(vanityId);
            player.info(`§aSuccessfully unlocked vanity §b${vanityId}§a for §e${target.username}§a.`);
        }

        else if (actionType === "revoke") {
            const vanityId = vanityRaw.result as string;
            target.revokeVanity(vanityId);
            player.info(`§6Successfully revoked vanity §b${vanityId}§6 from §e${target.username}§6.`);
        }
    }))
    .register("Moderation");