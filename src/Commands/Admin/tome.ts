import { CustomEnum, IntegerEnum, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload, EnchantmentTome, SealedTome, CustomEnchantEnum } from "../../Classes";
import { EnchantmentRarity } from "../../Types/types";

class RarityEnum extends CustomEnum {
    public static readonly identifier = "rarityEnum";
    public static options = Object.keys(EnchantmentRarity).filter(k => isNaN(Number(k)));
}

new CommandBuilder("tome", "Admin command to give enchantment tomes.")
    .setPermissions(["serenity.operator"])
    .addOverload(
        new CommandOverload({
            rarity: RarityEnum,
            amount: [IntegerEnum, true]
        }).onCallback((origin, { rarity, amount }) => {
            if (!(origin instanceof Player)) return;

            const rarityValue = EnchantmentRarity[rarity.result as keyof typeof EnchantmentRarity];
            //@ts-ignore
            const amountValue = amount?.result ?? 1;

            if (amountValue < 1) return origin.error("Amount must be at least 1.");

            const tome = new SealedTome(rarityValue, amountValue);
            origin.inventory.addItem(tome);
            origin.info(`§aGave you §e${amountValue}x §f${EnchantmentRarity[rarityValue]} Sealed Tome(s).`);
        })
    )
    .addOverload(
        new CommandOverload({
            enchantment: CustomEnchantEnum,
            strength: [IntegerEnum, true]
        }).onCallback((origin, { enchantment, strength }) => {
            if (!(origin instanceof Player)) return;

            const enchantmentId = enchantment.result as string;
            //@ts-ignore
            const strengthValue = strength?.result;

            if (strengthValue !== undefined && (strengthValue < 0 || strengthValue > 100)) {
                return origin.error("Strength must be between 0 and 100.");
            }

            try {
                const tome = new EnchantmentTome(enchantmentId);
                if (strengthValue !== undefined) {
                    tome.strength = strengthValue;
                }
                origin.inventory.addItem(tome);
                origin.info(`§aGave you an Enchantment Tome for §e${tome.getDisplayName()}§a.`);
            } catch (e: any) {
                origin.error(`Failed to create tome: ${e.message}`);
            }
        })
    )
    .register("Admin");
