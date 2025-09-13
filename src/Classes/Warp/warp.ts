import { Entity, Player } from "@serenityjs/core";
import { ServerWarp } from "../../Types/types";
import { WarpLocation } from "../../Configuration/Warp/warpLocation";
import { CommandBuilder, CommandOverload } from "../classes";
import { Vector3f } from "@serenityjs/protocol";

class Warp {
    private static readonly _warps: Map<keyof typeof WarpLocation, ServerWarp> = new Map();

    //@ts-ignore
    private static readonly _locations: { [key in WarpLocation]: Vector3f } = {}

    public static get locations() {
        return this._locations
    }

    /**
     * Registers a new server warp location.
     * @param id ID to reference the location.
     * @param warp Information for the location.
     */
    constructor(id: WarpLocation, warp: ServerWarp) {
        Warp._warps.set(id, warp);
        Warp._locations[id] = warp.location
        if (warp.commandAliases && warp.commandAliases.length > 0) {
            new CommandBuilder(warp.commandAliases[0]!, `Warp to ${warp.name}.`).setAliases(warp.commandAliases.slice(1)).addOverload(
                new CommandOverload({
                }).onCallback((origin) => {
                    if (!(origin instanceof Entity) || !origin.isPlayer()) return
                    origin.teleport(warp.location, origin.world.serenity.getWorld(warp.world)!.getDimension())
                    origin.info(`§eWarping to §a${warp.name}§e...`)
                    origin.info("§eWarp complete!")
                })
            ).register("Warps")
        }
    }

    public static registerAll() {
        new Warp(WarpLocation.SPAWN, { name: "Spawn", location: new Vector3f(0.5, 67, 0.5), world: "default", commandAliases: ["spawn", "hub", "lobby"] })
    }

    public static to(player: Player, id: keyof typeof WarpLocation) {
        const warp = this._warps.get(id)!
        player.teleport(warp.location, player.world.serenity.getWorld(warp.world)!.getDimension())
        player.info(`§eWarping to §a${warp.name}§e...`)
        player.info("§eWarp complete!")
    }
}

export { Warp }