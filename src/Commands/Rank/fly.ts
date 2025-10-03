import { Entity } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes"
import { AbilityIndex } from "@serenityjs/protocol";

new CommandBuilder("fly", "Toggles flight on islands.").setPermissions(["island.fly", "rank.fly"]).addOverload(
    new CommandOverload({
    }).onCallback((origin) => {
        if (!(origin instanceof Entity) || !origin.isPlayer()) return;

        origin.abilities.setAbility(AbilityIndex.MayFly, !origin.abilities.getAbility(AbilityIndex.MayFly));

        origin.info(`§eFlight §f>> ${origin.abilities.getAbility(AbilityIndex.MayFly) ? "§aON" : "§cOFF"}`)
    })
).register("Rank")