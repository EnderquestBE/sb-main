import { ActionForm, ModalForm, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload, PlayerEnum } from "../../Classes";
import { PlayerRank } from "../../Configuration/config";

function showRankForm(player: Player, target: Player) {
    const form = new ActionForm("Manage Ranks")
    form.content = `Managing ranks for §b${target.username}§f.`;
    form.button("Set Primary Rank");
    form.button("Push Rank");
    form.button("Pop Rank");
    form.button("Reset Active Ranks");
    form.button("Add Rank");
    form.button("Remove Rank");
    form.show(player, (result, error) => {
        if (result === null || error) return;

        switch (result) {
            case 0:
                // Set Primary Rank
                const primaryForm = new ModalForm("Set Primary Rank");
                const ranks = target.getRankIds();
                primaryForm.dropdown("Select new primary rank", ranks, ranks.indexOf(target.getPrimaryRank().id));
                primaryForm.show(player, (result, error) => {
                    if (result === null || error) return showRankForm(player, target);

                    const selectedRank = ranks[result[0] as number] as PlayerRank;
                    target.setPrimaryRank(selectedRank).then((result) => {
                        if (!result.success) {
                            player.error(`Failed to set primary rank: ${result.reason ?? "No reason provided."}`);
                            return;
                        }
                        player.info(`§bSet primary rank to §f${selectedRank} §afor §e${target.username}§a.`);
                    })
                })
                break;
            case 1:
                // Push Rank
                const pushForm = new ModalForm("Push Rank");
                const pushRanks = target.getRankIds();
                pushForm.dropdown("Select owned rank to push", pushRanks);
                pushForm.show(player, (result, error) => {
                    if (result === null || error) return showRankForm(player, target);
                    const selectedRank = pushRanks[result[0] as number] as PlayerRank;
                    target.pushActiveRank(selectedRank).then((result) => {
                        if (!result.success) {
                            player.error(`Failed to push rank: ${result.reason ?? "No reason provided."}`);
                            return;
                        }
                        player.info(`§aPushed rank §f${selectedRank} §ato §e${target.username}§a.`);
                    })
                })
                break;
            case 2:
                // Pop Rank
                const popForm = new ModalForm("Pop Rank");
                const popRanks = target.getActiveRankIds();
                if (popRanks.length === 0) {
                    player.error("Target player has no active ranks to pop.");
                    return;
                }
                popForm.dropdown("Select active rank to pop", popRanks);
                popForm.show(player, (result, error) => {
                    if (result === null || error) return showRankForm(player, target);
                    const selectedRank = popRanks[result[0] as number] as PlayerRank;
                    target.popActiveRank(selectedRank).then((result) => {
                        if (!result.success) {
                            player.error(`Failed to pop rank: ${result.reason ?? "No reason provided."}`);
                            return;
                        }
                        player.info(`§cPopped rank §f${selectedRank} §cfrom §e${target.username}§c.`);
                    })
                })
                break;
            case 3:
                // Reset Active Ranks
                target.setActiveRanks(["GUEST"]).then((result) => {
                    if (!result.success) {
                        player.error(`Failed to reset active ranks: ${result.reason ?? "No reason provided."}`);
                        return;
                    }
                    player.info(`§aReset active ranks for §e${target.username}§a.`);
                });
                break;
            case 4:
                // Add Rank
                const addForm = new ModalForm("Add Rank");
                const ownedRanks = target.getRankIds();
                const addRanks = Object.keys(PlayerRank).filter(r => !ownedRanks.includes(r));
                addForm.dropdown("Select rank to add", addRanks);
                addForm.show(player, (result, error) => {
                    if (result === null || error) return showRankForm(player, target);
                    const selectedRank = addRanks[result[0] as number] as PlayerRank;
                    target.addRank(selectedRank).then((result) => {
                        if (!result.success) {
                            player.error(`Failed to add rank: ${result.reason ?? "No reason provided."}`);
                            return;
                        }
                        player.info(`§aAdded rank §f${selectedRank} §ato §e${target.username}§a.`);
                    })
                })
                break;
            case 5:
                // Remove Rank
                const removeForm = new ActionForm("Remove Rank");
                const activeRanks = target.getRankIds();
                if (activeRanks.length === 0) {
                    player.error("Target player has no ranks to remove.");
                    return;
                }
                for (const rank of activeRanks) {
                    removeForm.button(rank);
                }
                removeForm.show(player, (result, error) => {
                    if (result === null || error) return showRankForm(player, target);
                    const selectedRank = activeRanks[result] as PlayerRank;
                    target.removeRank(selectedRank).then((result) => {
                        if (!result.success) {
                            player.error(`Failed to remove rank: ${result.reason ?? "No reason provided."}`);
                            return;
                        }
                        player.info(`§cRemoved rank §f${selectedRank} §cfrom §e${target.username}§c.`);
                    })
                });
                break;
        }
    })
}

new CommandBuilder("rank", "Manages player ranks.")
    .setPermissions(["serenity.operator"])
    .addOverload(
        new CommandOverload({
            player: PlayerEnum,
        }).onCallback((player, { player: targetName }) => {
            if (!(player instanceof Player)) return;

            const target = player.world.serenity.getPlayerByUsername(targetName.result as string);
            if (!target) {
                player.error("Player not found.");
                return;
            }

            showRankForm(player, target);
        })
    )
    .register("Admin");