import { ActionForm, CustomEnum, EntityInventoryTrait, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload, KitItem } from "../../Classes";
import { Kit, KitData } from "../../Configuration/Kit";
import { RANKS } from "../../Configuration/config";
import { CompoundTag, StringTag } from "@serenityjs/nbt";

class KitEnum extends CustomEnum {
    public static readonly identifier = "kit";
    public static options = Kit.keys;
}

function showKitMenu(player: Player, kits: KitData[]) {
    const form = new ActionForm("Kits", "Select a kit to view its details.");
    for (const kit of kits) {
        form.button(kit.name);
    }
    form.show(player, (result, error) => {
        if (result === null || error) return;
        const selectedKit = kits[result];
        if (!selectedKit) return;
        const details = new ActionForm(selectedKit.name);
        details.content = `§b§lName: §f${selectedKit.name}§r\n§cCooldown: §f${selectedKit.cooldown}h\n${selectedKit.rank !== "GUEST" ? ((player.hasRank(selectedKit.rank) ? "§a" : "§c") + `Requires §f${RANKS.get(selectedKit.rank)?.displayName}`) : ""}`;
        details.button("Redeem");
        details.button("Back");
        details.show(player, (selection, error) => {
            if (selection === null || error) return;
            if (selection === 0) {
                redeemKit(player, selectedKit);
            } else {
                showKitMenu(player, kits);
            }
        })
    });
}

function redeemKit(player: Player, kit: KitData) {
    const kitItem = new KitItem(kit.id);
    const inv = player.getTrait(EntityInventoryTrait).container;
    // Check if the kit is on cooldown.
    let kitEntries = player.getStorageEntry<CompoundTag>("KitCooldown")
    if (kitEntries) {
        const lastRedeemed = kitEntries.get<StringTag>(kit.id)?.valueOf();
        if (lastRedeemed) {
            const lastDate = new Date(lastRedeemed).getTime();
            const now = Date.now();
            const elapsedHours = (now - lastDate) / 3600000;
            if (elapsedHours < kit.cooldown) {
                const remaining = (kit.cooldown - elapsedHours).toFixed(1);
                player.sendMessage(`§cKit is on cooldown for §4${remaining} §cmore hours.`);
                return;
            }
        }
    } else {
        kitEntries = new CompoundTag("KitCooldown")
    }
    // Set the cooldown.
    kitEntries.set(kit.id, new StringTag(new Date().toISOString(), kit.id));
    player.setStorageEntry("KitCooldown", kitEntries);
    // Check if player's inventory is full.
    if (inv.emptySlotsCount === 0) {
        player.sendMessage("§cYour inventory is full.");
        return;
    }
    inv.addItem(kitItem);
    player.sendMessage(`§bRedeemed §f${kit.displayName}§b!`);
}

new CommandBuilder("kit", "Opens the kit selection menu.")
    .setAliases(["kits"])
    .addOverload(
        new CommandOverload({
            identifier: [KitEnum, true]
        }).onCallback((player, { identifier }) => {
            if (!(player instanceof Player)) return;
            //@ts-ignore
            const kitId = identifier?.result;
            if (kitId) {
                const kit = Kit.get(kitId);
                if (!kit) return player.error("That kit does not exist.");
                // Redeem the kit.
                redeemKit(player, kit);
            } else {
                showKitMenu(player, Kit.getAll());
            }
        })
    )
    .register("General");