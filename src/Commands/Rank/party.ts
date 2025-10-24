import { ActionForm, MessageForm, ModalForm, Player, Serenity } from "@serenityjs/core";
import { CommandBuilder, CommandOverload, Filter, Island } from "../../Classes";
import { Vector3f } from "@serenityjs/protocol";

const hasThrownParty = new Set<string>();

type PartyDetails = {
    details: {
        message: string;
    };
    location: string;
    guestlist: string[];
}

function createPartyForm(player: Player, island: Island, serenity: Serenity, PARTY: PartyDetails) {
    const form = new ActionForm("Throw Party");
    form.content = "Configure the details of your party.";
    form.button("Set Details");
    form.button("Set Location");
    form.button("Manage Guestlist");
    form.button("Start Party");
    form.show(player, (result, error) => {
        if (result === null || error) {
            return player.info("§cParty creation canceled.");
        }
        switch (result) {
            case 0:
                const detailsForm = new ModalForm("Party Details");
                detailsForm.input("Message", "I'm throwing a party, come visit my island!", PARTY.details.message);
                detailsForm.show(player, (result, error) => {
                    if (result === null || error) return createPartyForm(player, island, serenity, PARTY);
                    let message = result[0] as string;
                    if (!message || message.length > 164) {
                        const errorForm = new MessageForm("Invalid Message");
                        errorForm.content = "§cMessage must be under 164 characters.";
                        errorForm.show(player, () => {
                            return createPartyForm(player, island, serenity, PARTY);
                        });
                        return;
                    }

                    if (Filter.contains(message)) {
                        message = Filter.censor(message);
                    } else if (/^[a-zA-Z0-9 _!?#@$&:()\-]+$/.test(message) === false) {
                        const errorForm = new MessageForm("Invalid Message");
                        errorForm.content = "§cMessage may only contain letters, numbers, and basic symbols.";
                        errorForm.show(player, () => {
                            return createPartyForm(player, island, serenity, PARTY);
                        });
                        return;
                    }

                    PARTY.details.message = message;

                    createPartyForm(player, island, serenity, PARTY);
                });
                break;
            case 1:
                const locationForm = new ActionForm("Party Location");
                locationForm.content = "Select an island home to host the party at.";
                locationForm.button("Spawn (default)");
                const homes = island.getHomes();
                for (const home of homes) {
                    locationForm.button(home.name);
                }
                locationForm.show(player, (result, error) => {
                    if (result === null || error) return createPartyForm(player, island, serenity, PARTY);
                    if (result > 0) {
                        const selectedHome = homes[result - 1]!;
                        PARTY.location = selectedHome.name;
                    } else {
                        PARTY.location = "spawn";
                    }
                    createPartyForm(player, island, serenity, PARTY);
                });
                break;
            case 2:
                const players = serenity.getPlayers();
                const selectedPlayers: string[] = PARTY.guestlist;
                function showGuestlistForm() {
                    const guestlistForm = new ActionForm("Guest List");
                    guestlistForm.content = `Select a name to invite/uninvite them.`;
                    for (const player of players) {
                        guestlistForm.button(`${selectedPlayers.includes(player.xuid) ? "§d" : ""}${player.username}`)
                    }
                    guestlistForm.button("Submit");
                    guestlistForm.show(player, (result, error) => {
                        if (result === null || error) return createPartyForm(player, island, serenity, PARTY);
                        if (result === players.length) {
                            PARTY.guestlist = selectedPlayers;
                            return createPartyForm(player, island, serenity, PARTY);
                        }
                        const selectedPlayer = players[result]!;
                        const index = selectedPlayers.indexOf(selectedPlayer.xuid);
                        if (index > -1) {
                            selectedPlayers.splice(index, 1);
                        } else {
                            selectedPlayers.push(selectedPlayer.xuid);
                        }
                        showGuestlistForm();
                    });
                }
                showGuestlistForm();
                break;
            case 3:
                const confirmationForm = new MessageForm("Confirm Party");
                confirmationForm.content = `§l§7Preview:§r\n§e${player.username} §dis throwing a party!\n§fMessage: §7${PARTY.details.message}\n\n§cAre you ready to start the party?`;
                confirmationForm.button1 = "Start Party";
                confirmationForm.button2 = "Cancel";
                confirmationForm.show(player, (result, error) => {
                    if (result === null || error || result === false) return createPartyForm(player, island, serenity, PARTY);
                    // Invite guests.
                    const invitationForm = new MessageForm("Party Invitation");
                    invitationForm.content = `§e${player.username} §dis throwing a party!\n§fMessage: §7${PARTY.details.message}\n\n§cWould you like to attend?`;
                    invitationForm.button1 = "Accept";
                    invitationForm.button2 = "Decline";
                    const islandWorld = island.getWorld()?.getDimension();
                    if (!islandWorld) {
                        return player.error("§cUnable to start party: Island world not found.");
                    }
                    for (const xuid of PARTY.guestlist) {
                        const guest = serenity.getPlayerByXuid(xuid);
                        if (!guest) continue;
                        if (guest.getSetting("blockPartyRequests") === true) continue;
                        invitationForm.show(guest, (result, error) => {
                            if (result === null || error || result === false) {
                                guest.info(`§cParty invitation declined.`);
                                return;
                            }
                            island.teleport(guest);
                            if (PARTY.location !== "spawn") {
                                const home = island.getHome(PARTY.location);
                                if (home) {
                                    const { x, y, z } = home.location;
                                    guest.teleport(new Vector3f(x, y, z), islandWorld);
                                }
                            }
                            guest.info("§aParty invitation accepted! §dEnjoy the party!");
                            guest.info(`§eYou have been teleported to §a${player.username}§e's island for their party!`);
                            player.info(
                                `§a${guest.username} §ejust teleported to your island for the §dparty§e!`
                            )
                        });
                    }
                    // Show confirmation.
                    player.info("§6Your party has been hosted successfully.\n§eRemember to be a good host!");
                    hasThrownParty.add(player.xuid);
                });
                break;
        }
    });
}

new CommandBuilder("party", "Throw a party on your island!")
    .setAliases(["party"])
    .setPermissions(["rank.party"])
    .addOverload(
        new CommandOverload({}).onCallback((player) => {
            if (!(player instanceof Player)) return;

            if (hasThrownParty.has(player.xuid)) {
                return player.error("§cPlease wait until next restart to throw another party.");
            }

            const island = player.getIsland()
            if (!island)
                return player.error(
                    `You don't have an island! Use /is create <name> to create one.`
                );

            const serenity = player.world.serenity;

            const PARTY: PartyDetails = {
                details: {
                    message: "I'm throwing a party, come visit my island!"
                },
                location: "spawn",
                guestlist: []
            }

            createPartyForm(player, island, serenity, PARTY);
        })
    )
    .register("Rank");