import { CustomEnum, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes"
import { GameRule } from "@serenityjs/protocol";

const TimeValues: { [key: string]: number } = {
    sunrise: 0,
    noon: 6000,
    sunset: 12500,
    midnight: 18000
}

class TimeSetEnum extends CustomEnum {
    public static readonly identifier = "timeSet"
    public static options = ["set"]
}

class TimeValueEnum extends CustomEnum {
    public static readonly identifier = "timeValue"
    public static options = Object.keys(TimeValues)
}

class TimeActionEnum extends CustomEnum {
    public static readonly identifier = "timeAction"
    public static options = ["start", "stop"]
}

new CommandBuilder("time", "Configures the daytime of your island.").setPermissions(["rank.time"])
    /*
        .addOverload(
            new CommandOverload({
                action: TimeActionEnum
            }).onCallback((player, { action: actionRaw }) => {
                if (!(player instanceof Player)) return;
    
                const action = actionRaw.result as string;
    
                const world = player.world;
    
                if (player.getIslandName() !== world.identifier.substring(3)) {
                    player.error("You can only do this on your island.");
                    return;
                }
    
                if (action === "stop") {
                    //@ts-ignore
                    world.setGamerule(GameRule.DoDaylightCycle, false);
                    player.info(`§eTime has been §cstopped§e.`);
                }
    
                else {
                    //@ts-ignore
                    world.setGamerule(GameRule.DoDaylightCycle, true);
                    player.info(`§eTime has been §astarted§e.`);
                }
            })
        )
            */
    .addOverload(
        new CommandOverload({
            set: TimeSetEnum,
            value: TimeValueEnum
        }).onCallback((player, { value: valueRaw }) => {
            if (!(player instanceof Player)) return;

            const value = valueRaw.result as string;

            const world = player.world;

            if (player.getIslandName() !== world.identifier.substring(3)) {
                player.error("You can only do this on your island.");
                return;
            }

            const timeValue = TimeValues[value];
            if (timeValue === undefined) {
                player.error("Invalid time value.");
                return;
            }

            world.setTimeOfDay(timeValue);
            player.info(`§eTime set to §b${value}§e.`);
        })
    ).register("Rank")