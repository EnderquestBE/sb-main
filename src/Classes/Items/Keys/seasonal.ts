import { CustomItemType, ItemIdentifier } from "@serenityjs/core";
import { CrateKey } from "./base";
import { CrateIdentifier } from "../../../Types/types";
import { ItemCustomCrateKeyTrait } from "../../../Traits/Item/traits";
import { StringTag } from "@serenityjs/nbt";

const SeasonalCrateKeyType = new CustomItemType("cratekey:seasonal", { isComponentBased: true })
// Season Switch
const month = new Date().getMonth();
/* Winter: Snow Golem */
if (month === 11 || month <= 1) SeasonalCrateKeyType.components.setIcon({ default: "spawn_egg_snow_golem" })
/* Spring: Rabbit */
else if (month >= 2 && month <= 4) SeasonalCrateKeyType.components.setIcon({ default: "spawn_egg_rabbit" })
/* Summer: Frog */
else if (month >= 5 && month <= 7) SeasonalCrateKeyType.components.setIcon({ default: "spawn_egg_frog" })
/* Fall: Bat */
else if (month >= 8 && month <= 10) SeasonalCrateKeyType.components.setIcon({ default: "spawn_egg_bat" })
SeasonalCrateKeyType.registerTrait(ItemCustomCrateKeyTrait)

class SeasonalCrateKey extends CrateKey {
    public static readonly identifier = SeasonalCrateKeyType.identifier as ItemIdentifier;
    public static readonly crateType = CrateIdentifier.Seasonal;

    constructor(amount: number = 1) {
        super(
            SeasonalCrateKey.identifier,
            SeasonalCrateKey.crateType,
            "§dSeasonal",
        );
        this.stackSize = amount;
        // Set the expiration date on the key in either 30 days or the end of the current season, whichever is sooner.
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        // Calculate end of current season
        const month = now.getMonth();
        let seasonEnd: Date;
        if (month === 11 || month <= 1) { // End of February
            seasonEnd = new Date(now.getFullYear() + (month === 11 ? 1 : 0), 2, 0, 23, 59, 59, 999);
        } else if (month >= 2 && month <= 4) { // End of May
            seasonEnd = new Date(now.getFullYear(), 5, 0, 23, 59, 59, 999);
        } else if (month >= 5 && month <= 7) { // End of August
            seasonEnd = new Date(now.getFullYear(), 8, 0, 23, 59, 59, 999);
        } else { // End of November
            seasonEnd = new Date(now.getFullYear(), 11, 0, 23, 59, 59, 999);
        }

        // Use the earlier date
        //const expirationDate = in30Days < seasonEnd ? in30Days : seasonEnd;
        // For testing purposes, set the key to expire in 30 seconds.
        const expirationDate = new Date(Date.now() + 30 * 1000)
        const expiration = expirationDate.toISOString()
        this.nbt.set("Expires", new StringTag(expiration, "Expires"));
        const trait = this.getTrait(ItemCustomCrateKeyTrait) ?? this.addTrait(ItemCustomCrateKeyTrait);
        trait.updateExpiration(expiration);
    }
}

export { SeasonalCrateKey, SeasonalCrateKeyType };