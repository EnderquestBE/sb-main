import { Player, PlayerHungerTrait } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";
import { Utils } from "../../Utils/utils";

new CommandBuilder("feed", "Restores you to full hunger for money.")
    .setPermissions(["rank.feed"])
    .addOverload(
        new CommandOverload({}).onCallback((player) => {
            if (!(player instanceof Player)) return

            const hunger = player.getTrait(PlayerHungerTrait);
            const food = hunger?.currentValue;

            if (food === hunger.maximumValue) return player.error("You are not hungry.");

            // Calculate repair cost based on
            const cost = Math.ceil((hunger.maximumValue - food) * 100);
            if (player.getMoney() < cost) return player.error(`It costs §6$${Utils.formatInt(cost)} §cto restore your hunger.`);

            hunger.currentValue = hunger.maximumValue;
            player.removeMoney(cost);
            player.info(`§bYour hunger has been restored for §6$${Utils.formatInt(cost)}§b.`);
        })
    )
    .register("Rank");