import { Player, StringEnum } from "@serenityjs/core";
import { CommandBuilder, CommandOverload, Filter } from "../../Classes";
import { NametagHandler, ServerTaskHandler } from "../../Handlers";

new CommandBuilder("nickname", "Changes your nametag nickname.")
    .setAliases(["nick"])
    .setPermissions(["rank.nickname"])
    .addOverload(
        new CommandOverload({
            name: [StringEnum, true],
        }).onCallback((player, { name: nameRaw }) => {
            if (!(player instanceof Player)) return

            //@ts-ignore
            let name = nameRaw?.result;
            if (!name) {
                player.setNickname("");
                ServerTaskHandler.queueTask(() => {
                    NametagHandler.format(player);
                }, 100);
                player.info("§cYour nickname has been reset.");
                return;
            }
            if (name.length < 6 || name.length > 15) return player.error("Name must be between 6 and 15 characters.");

            if (Filter.contains(name)) {
                return player.error("Nickname is not allowed.");
            } else if (/^[a-zA-Z0-9]+$/.test(name) === false) {
                return player.error("Name may only contain letters and numbers.");
            }

            player.setNickname(name);
            ServerTaskHandler.queueTask(() => {
                NametagHandler.format(player);
            }, 100);
            player.info(`§eYour nickname has been changed to §7'§6${name}§7'§e.`);
        })
    )
    .register("Rank");