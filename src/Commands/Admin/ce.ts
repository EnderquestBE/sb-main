import { CustomEnum, IntegerEnum, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload, CustomEnchantEnum } from "../../Classes";

class EnchantAddEnum extends CustomEnum {
    public static readonly identifier = "ceAdd";
    public static options = ["add"];
}

class EnchantRemoveEnum extends CustomEnum {
    public static readonly identifier = "ceRemove";
    public static options = ["remove"];
}

new CommandBuilder("ce", "Adds or removes a custom enchantment from the held item.")
    .setPermissions(["serenity.operator"])
    .addOverload(
        new CommandOverload({
            remove: EnchantRemoveEnum,
            enchantmentId: CustomEnchantEnum
        }).onCallback((origin, { enchantmentId }) => {
            if (!(origin instanceof Player)) return;

            const item = origin.getHeldItem();
            if (!item) {
                return origin.error("You must be holding an item.");
            }

            const id = enchantmentId.result as string;
            if (!item.hasCustomEnchantment(id)) {
                return origin.error(`The item does not have the ${id} enchantment.`);
            }

            item.removeCustomEnchantment(id);
            item.update()
            origin.info(`§aSuccessfully removed §e${id} §afrom your held item.`);
        })
    )
    .addOverload(
        new CommandOverload({
            add: EnchantAddEnum,
            enchantmentId: CustomEnchantEnum,
            level: [IntegerEnum, true] // Optional level, defaults to 1
        }).onCallback((origin, { enchantmentId, level }) => {
            if (!(origin instanceof Player)) return;

            const item = origin.getHeldItem();
            if (!item) {
                return origin.error("You must be holding an item to enchant.");
            }

            const id = enchantmentId.result as string;

            if (item.hasCustomEnchantment(id)) {
                return origin.error(`The item already has the ${id} enchantment.`);
            }

            //@ts-ignore
            const enchantLevel = level?.result ?? 1;
            if (enchantLevel <= 0) {
                return origin.error("Enchantment level must be greater than 0.");
            }

            item.addCustomEnchantment(id, enchantLevel);
            item.update()
            origin.info(`§aSuccessfully added §e${id} ${enchantLevel} §ato your held item.`);
        })
    )
    .register("Admin");