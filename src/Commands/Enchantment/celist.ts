import { ActionForm, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";
import { EnchantmentHandler } from "../../Handlers";
import { Utils } from "../../Utils/utils";
import { EnchantmentRarity } from "../../Types/types";
import { MainShop } from "../../Configuration/Shop/Main/main";

new CommandBuilder("celist", "Shows information for all custom enchantments.")
    .addOverload(
        new CommandOverload({}).onCallback((origin) => {
            if (!(origin instanceof Player)) return;

            const player = origin as Player;

            const form = new ActionForm("CE List")
            form.content = "Click on a rarity to view its CEs."

            const rarities = Object.keys(EnchantmentRarity).filter(r => isNaN(Number(r)))
            for (const rarity of rarities) {
                form.button(rarity)
            }

            function showRaritiesList() {
                form.show(player, (result, error) => {
                    if (error || result === null) return;
                    const selectedRarity = rarities[result];
                    if (!selectedRarity) return;

                    const form2 = new ActionForm(selectedRarity + " CEs");
                    form2.content = "Click on an enchantment to view more information about it."
                    const enchantList = EnchantmentHandler.getAllOfRarity(EnchantmentRarity[selectedRarity as keyof typeof EnchantmentRarity])
                    if (enchantList.length === 0) {
                        return player.error("There are no enchantments currently available for this rarity.")
                    }
                    const enchantNames = enchantList.map(e => e.name)
                    for (const enchant of enchantNames) {
                        form2.button(Utils.formatString(enchant))
                    }

                    function showEnchantList() {
                        form2.show(player, (result2, error2) => {
                            if (error2 || result2 === null) return showRaritiesList();
                            const enchantInfo = enchantList[result2];
                            if (!enchantInfo) return;

                            const form3 = new ActionForm(enchantInfo.name);
                            form3.content = `§fName: §l${enchantInfo.color}${enchantInfo.name}§r\n§fRarity: ${enchantInfo.color}${Utils.formatString(EnchantmentRarity[enchantInfo.rarity])}\n§fDescription: §7${enchantInfo.description}\n\n§fUsable on: §b${enchantInfo.slots.map(s => Utils.formatString(s)).join(", ")}\n§fIncompatible with: §c${enchantInfo.incompatible.length > 0 ? enchantInfo.incompatible.map(id => Utils.formatString(id)).join(", ") : "§7None"}`;

                            form3.button("Purchase")
                            form3.button("Back")

                            form3.show(player, (result3, error3) => {
                                if (error3 || result3 === null) return
                                if (result3 === 1) return showEnchantList();
                                if (result3 === 0) return MainShop.showCategory(player, "magic")
                            });
                        });
                    }
                    showEnchantList();
                });
            }
            showRaritiesList();
        }))
    .register("Enchantment");
