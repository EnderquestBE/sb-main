import { Entity } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes"
import { MainShop } from "../../Configuration/Shop/Main/main";

new CommandBuilder("shop", "Opens the server shop.").addOverload(
    new CommandOverload({
    }).onCallback((origin) => {
        if (!(origin instanceof Entity) || !origin.isPlayer()) return;
        MainShop.show(origin)
    })
).register("General")