import { ActionForm, CustomEnum, EntityInventoryTrait, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload, KitItem } from "../../Classes";
import { Kit, KitData } from "../../Configuration/Kit";
import { RANKS } from "../../Configuration/config";
import { CompoundTag, StringTag } from "@serenityjs/nbt";

class KitEnum extends CustomEnum {
    public static readonly identifier = "kit";
    public static options = [...Kit.keys, "claimall"];
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
        const ranks = player.getActiveRanks();
        const requiredRank = RANKS.values().find((x) => x.kits.includes(selectedKit.id));
        const details = new ActionForm(selectedKit.name);
        details.content = `§b§lName: §f${selectedKit.displayName}§r\n§cCooldown: §f${selectedKit.cooldown}h\n${((ranks.some((rank) => rank.kits.includes(selectedKit.id)) ? "§a" : "§c") + `Required Rank: §f${requiredRank?.displayName}`)}`;
        details.button("Redeem");
        details.button("Back");
        details.show(player, (selection, error) => {
            if (selection === null || error) return showKitMenu(player, kits);
            if (selection === 0) {
                if (!ranks.some((rank) => rank.kits.includes(selectedKit.id))) {
                    player.error("You do not have access to this kit.");
                    return;
                }
                redeemKit(player, selectedKit);
            } else {
                showKitMenu(player, kits);
            }
        })
    });
}

function redeemKit(player: Player, kit: KitData) {
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
                player.error(`Kit is on cooldown for ${remaining} more hours.`);
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
    const inv = player.getTrait(EntityInventoryTrait).container;
    if (inv.emptySlotsCount === 0) {
        player.error("Your inventory is full.");
        return;
    }
    const kitItem = new KitItem(kit.id);
    inv.addItem(kitItem);
    player.info(`§bRedeemed §f${kit.displayName} Kit§b!`);
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
                if (kitId === "claimall") {
                    const kits = Kit.getAll();
                    const ranks = player.getActiveRanks();
                    for (const kit of kits) {
                        if (!ranks.some((rank) => rank.kits.includes(kit.id))) continue;
                        redeemKit(player, kit);
                    }
                } else {
                    const kit = Kit.get(kitId);
                    if (!kit) return player.error("That kit does not exist.");
                    // Redeem the kit.
                    redeemKit(player, kit);
                }
            } else {
                showKitMenu(player, Kit.getAll());
            }
        })
    )
    .register("General");