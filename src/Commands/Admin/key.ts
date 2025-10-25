import { CustomEnum, IntegerEnum, Player } from "@serenityjs/core";
import {
    CommandBuilder,
    CommandOverload,
    CommonCrateKey,
    CrateKey,
    RareCrateKey,
    EpicCrateKey,
    LegendaryCrateKey,
    DivineCrateKey,
    VoterCrateKey,
    SeasonalCrateKey
} from "../../Classes";
import { CrateIdentifier } from "../../Types/types";

// Enum for the Crate types
class CrateTypeEnum extends CustomEnum {
    public static readonly identifier = "CrateTypeEnum";
    public static options = Object.values(CrateIdentifier);
}

new CommandBuilder("key", "Gives a specified crate key.")
    .setPermissions(["serenity.operator"])
    .addOverload(
        new CommandOverload({
            type: CrateTypeEnum,
            amount: [IntegerEnum, true],
        }).onCallback((origin, { type, amount }) => {
            if (!(origin instanceof Player)) return;

            const player = origin;
            const CrateType = type.result as keyof typeof CrateIdentifier;
            if (!CrateType) {
                return player.error("Crate type is invalid.");
            }
            //@ts-ignore
            const amountValue = amount?.result ?? 1;

            if (amountValue < 1) {
                return player.error("Amount must be at least 1.");
            }

            let CrateItem: CrateKey | null = null;

            switch (CrateType) {
                case "Common":
                    CrateItem = new CommonCrateKey(amountValue);
                    break;
                case "Rare":
                    CrateItem = new RareCrateKey(amountValue);
                    break;
                case "Epic":
                    CrateItem = new EpicCrateKey(amountValue);
                    break;
                case "Legendary":
                    CrateItem = new LegendaryCrateKey(amountValue);
                    break;
                case "Divine":
                    CrateItem = new DivineCrateKey(amountValue);
                    break;
                case "Voter":
                    CrateItem = new VoterCrateKey(amountValue);
                    break;
                case "Seasonal":
                    CrateItem = new SeasonalCrateKey(undefined, amountValue);
                    break;
                default:
                    return player.error("Crate type is invalid.");
            }

            if (CrateItem) {
                player.inventory.addItem(CrateItem);
                player.info(`§aGave you §e${amountValue}x ${CrateItem.getDisplayName()}§a.`);
            }
        })
    )
    .register("Admin");
