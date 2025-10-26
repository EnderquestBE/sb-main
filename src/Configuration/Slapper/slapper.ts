import { Rotation, Vector3f } from "@serenityjs/protocol";
import { Slapper } from "../../Classes";
import { SlapperShopGeometry } from "./Geometry/shop";
import { SlapperVisitGeometry } from "./Geometry/visit";
import { SlapperTeleportGeometry } from "./Geometry/teleport";
import { MainShop } from "../Shop/Main/main";
import { PalmGeometry } from "../Morph/Geometry/palm";

/* From left (Quests) to right (Kits) */

/* LEFT SIDE */

// Guide
Slapper.registerSlapper({
    identifier: "slapper:guide",
    name: "§l§eGuide§r",
    position: new Vector3f(-18.5, 66, -6.5),
    texture: "top_hat_chicken_shirt.png",
    skinOptions: { geometry: PalmGeometry, geometryKey: "geometry.palm" },
    rotation: new Rotation(-90, 0, -90),
    function: (player) => {
        player.executeCommand("guides")
    }
})

// Auction House
/*
Slapper.registerSlapper({
    identifier: "slapper:auctionhouse",
    name: "§l§cAuction House§r",
    position: new Vector3f(-15.5, 66, -10.5),
    texture: "auctioneer.png",
    rotation: new Rotation(-90, 0, -90),
    function: (player) => {
        player.info("§7This feature is coming soon!")
    }
})
*/

// Shop
Slapper.registerSlapper({
    identifier: "slapper:shop",
    name: "§l§bShop§r",
    position: new Vector3f(-11.5, 66, -14.5),
    texture: "shop.png",
    skinOptions: { geometry: SlapperShopGeometry, geometryKey: "geometry.Redstone.artisan_slim" },
    function: (player) => {
        MainShop.show(player)
    }
})

// Island Teleport
Slapper.registerSlapper({
    identifier: "slapper:istp",
    name: "§l§eGo to Island§r",
    position: new Vector3f(-6.5, 66, -16.5),
    texture: "istp.png",
    skinOptions: { geometry: SlapperTeleportGeometry, geometryKey: "geometry.BeachPartySkinPack.CoolnCasual" },
    function: (player) => {
        const island = player.getIsland()
        if (!island) player.executeCommand("is create")
        else player.executeCommand("is go");
    }
})

/* RIGHT SIDE */

// Visit Islands
Slapper.registerSlapper({
    identifier: "slapper:visitislands",
    name: "§l§aVisit Islands§r",
    position: new Vector3f(7.5, 66, -16.5),
    texture: "visitislands.png",
    skinOptions: { geometry: SlapperVisitGeometry, geometryKey: "geometry.MiniGameHeroes.MiniGameHeroesCowGlider" },
    function: (player) => {
        player.executeCommand("is visit");
    }
})

// Island Actions
Slapper.registerSlapper({
    identifier: "slapper:islandactions",
    name: "§l§dIsland Actions§r",
    position: new Vector3f(12.5, 66, -14.5),
    texture: "islandactions.png",
    skinOptions: { armSize: "slim" },
    function: (player) => {
        player.executeCommand("is help")
    }
})

// PvP Arena
/*
Slapper.registerSlapper({
    identifier: "slapper:pvp",
    name: "§l§4PvP Arena§r",
    position: new Vector3f(16.5, 66, -10.5),
    texture: "pvp.png",
    rotation: new Rotation(90, 0, 90),
    skinOptions: { armSize: "slim" },
    function: (player) => {
        player.info("§7This feature is coming soon!")
    }
})
*/

// Kits
Slapper.registerSlapper({
    identifier: "slapper:kits",
    name: "§l§6Kits§r",
    position: new Vector3f(19.5, 66, -6.5),
    texture: "kits.png",
    rotation: new Rotation(90, 0, 90),
    skinOptions: { armSize: "slim" },
    function: (player) => {
        player.executeCommand("kits")
    }
})