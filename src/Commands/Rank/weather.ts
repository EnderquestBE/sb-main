import { CustomEnum, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes"

class WeatherSetEnum extends CustomEnum {
    public static readonly identifier = "weatherSet"
    public static options = ["set"]
}

class WeatherValueEnum extends CustomEnum {
    public static readonly identifier = "weatherValue"
    public static options = ["clear", "rain", "thunder"]
}

new CommandBuilder("weather", "Configures the weather of your island.").setPermissions(["rank.weather"]).addOverload(
    new CommandOverload({
        set: WeatherSetEnum,
        value: WeatherValueEnum
    }).onCallback((player, { value: valueRaw }) => {
        if (!(player instanceof Player)) return;

        const value = valueRaw.result as string;

        const world = player.world;

        if (player.getIslandName() !== world.identifier.substring(3)) {
            player.error("You can only do this on your island.");
            return;
        }

        const weatherValue = WeatherValueEnum.options.find(option => option === value);
        if (!weatherValue) {
            player.error("Invalid weather value.");
            return;
        }

        //@ts-ignore
        world.setWeather(weatherValue);
        player.info(`§eWeather set to §b${value}§e.`);
    })
).register("Rank")