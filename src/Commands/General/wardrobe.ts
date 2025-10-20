import { ActionForm, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";
import { VanityInfo } from "../../Types/types";

function showWardrobeForm(player: Player) {
    const form = new ActionForm("Select a Vanity Slot");
    form.content = "Select a vanity slot to manage.";
    const [slot1, slot2, slot3] = player.getEquippedVanity();

    form.button(slot1?.name ?? "Slot 1");
    form.button(slot2?.name ?? "Slot 2");
    form.button(slot3?.name ?? "Slot 3");
    form.button("Clear All");
    form.show(player, (result, error) => {
        if (result === null || error) return;
        if (result === 3) {
            player.unequipVanity(1);
            player.unequipVanity(2);
            player.unequipVanity(3);
            player.sendMessage("§cYour vanity has been cleared.");
        } else {
            const slot = result + 1;
            const vanityInfo = player.getVanity(slot as 1 | 2 | 3);

            if (!vanityInfo) {
                showSlotForm(player, slot as 1 | 2 | 3);
            } else {
                const form2 = new ActionForm(vanityInfo.name);
                form2.content = "Choose an action for this slot.";
                form2.button("Change");
                form2.button("Unequip");
                form2.button("Back");
                form2.show(player, (result2, error2) => {
                    if (result2 === null || error2) return;
                    if (result2 === 0) {
                        showSlotForm(player, slot as 1 | 2 | 3);
                    } else if (result2 === 1) {
                        player.unequipVanity(slot as 1 | 2 | 3);
                        player.sendMessage(`§eYou have §cunequipped §d${vanityInfo.name}§e.`);
                    } else {
                        showWardrobeForm(player);
                    }
                })
            }
        }

    });
}

function showSlotForm(player: Player, slot: 1 | 2 | 3) {
    const form2 = new ActionForm("Slot " + slot);
    form2.content = "Select an owned vanity item to equip.";
    const ownedVanity = player.getOwnedVanity();
    const equippedVanity = player.getEquippedVanity();
    let entries: VanityInfo[] = [];
    for (const item of ownedVanity) {
        if (equippedVanity.includes(item)) continue;
        form2.button(item.name);
        entries.push(item);
    }
    form2.button("Back");
    form2.show(player, (result2, error2) => {
        if (result2 === null || error2) return;
        if (result2 === entries.length) {
            return showWardrobeForm(player);
        }
        const selectedItem = entries[result2];
        if (!selectedItem) return;
        player.equipVanity(slot, selectedItem.id);
        player.sendMessage(`§eYou have §aequipped §d${selectedItem.name}§e.`);
    });
}


new CommandBuilder("wardrobe", "Manage your vanity wardrobe.")
    .setAliases(["cosmetics", "closet"])
    .addOverload(
        new CommandOverload({}).onCallback((player) => {
            if (!(player instanceof Player)) return;
            showWardrobeForm(player);
        })
    )
    .register("General");