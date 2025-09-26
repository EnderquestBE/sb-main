import { Rotation, Vector3f } from "@serenityjs/protocol";
import { Slapper } from "../../Classes";
import { SlapperShopGeometry } from "./Geometry/shop";
import { SlapperVisitGeometry } from "./Geometry/visit";
import { SlapperTeleportGeometry } from "./Geometry/teleport";
import { MainShop } from "../Shop/Main/main";

/* From left (Quests) to right (Kits) */

/* LEFT SIDE */

// Quests
/*
Slapper.registerSlapper({
    identifier: "slapper:quests",
    name: "§l§5Quests§r",
    position: new Vector3f(-18.5, 66, -6.5),
    skinURL: "https://drive.usercontent.google.com/u/0/uc?id=1srKfcocAmmPpCRqCUoS6pUYrMkYXJ0kb&export=download",
    rotation: new Rotation(-90, 0, -90),
    function: (player) => {
        player.info("§7This feature is coming soon!")
    }
})
*/

// Auction House
/*
Slapper.registerSlapper({
    identifier: "slapper:auctionhouse",
    name: "§l§cAuction House§r",
    position: new Vector3f(-15.5, 66, -10.5),
    skinURL: "https://drive.usercontent.google.com/u/0/uc?id=125tbDFQQPj5VslnjRWKIWtbpr1_dNVZW&export=download",
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
    skinURL: "https://drive.usercontent.google.com/u/0/uc?id=1LfCNlLIcgwYlhlthJnkEYpoEG4k5oWOT&export=download",
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
    skinURL: "https://drive.usercontent.google.com/u/0/uc?id=1-PGeb-RoKUkUjuIoOMxZK6CxuKwHM_kE&export=download",
    skinOptions: { geometry: SlapperTeleportGeometry, geometryKey: "geometry.BeachPartySkinPack.CoolnCasual" },
    function: (player) => {
        player.executeCommand("is go");
    }
})

/* RIGHT SIDE */

// Visit Islands
Slapper.registerSlapper({
    identifier: "slapper:visitislands",
    name: "§l§aVisit Islands§r",
    position: new Vector3f(7.5, 66, -16.5),
    skinURL: "https://drive.usercontent.google.com/u/0/uc?id=1Kckg2Ix4iw5_p7PNz-8_nfXzE3DDNhEQ&export=download",
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
    skinURL: "https://drive.usercontent.google.com/u/0/uc?id=1Gnq6zQ21xh4HLPemuurLzbzGTqU2QDzP&export=download",
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
    skinURL: "https://drive.usercontent.google.com/u/0/uc?id=1BQDLca-q7rahtz24qIufA-aN1rr9HwPf&export=download",
    rotation: new Rotation(90, 0, 90),
    skinOptions: { armSize: "slim" },
    function: (player) => {
        player.info("§7This feature is coming soon!")
    }
})
*/

// Kits
/*
Slapper.registerSlapper({
    identifier: "slapper:kits",
    name: "§l§6Kits§r",
    position: new Vector3f(19.5, 66, -6.5),
    skinURL: "https://drive.usercontent.google.com/u/0/uc?id=1EEYfoMSic5YK3pvlfXwByj39lwAO_027&export=download",
    rotation: new Rotation(90, 0, 90),
    skinOptions: { armSize: "slim" },
    function: (player) => {
        player.info("§7This feature is coming soon!")
    }
})
*/