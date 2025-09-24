import { Entity } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes"
import { AbilityIndex } from "@serenityjs/protocol";

new CommandBuilder("fly", "Toggles flight on islands.").setPermissions(["island.fly", "rank.fly"]).addOverload(
    new CommandOverload({
    }).onCallback((origin) => {
        if (!(origin instanceof Entity) || !origin.isPlayer()) return;

        origin.abilities.set(AbilityIndex.MayFly, !origin.abilities.mayFly);

        origin.info(`§eFlight §f>> ${origin.abilities.mayFly ? "§aON" : "§cOFF"}`)
    })
).register("Rank")