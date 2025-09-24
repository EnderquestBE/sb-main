import { CustomEnum } from "@serenityjs/core";
import { EnchantmentHandler } from "../../../Handlers/Enchantment/handler";
import { Enchantment } from "@serenityjs/protocol";

class AllEnchantEnum extends CustomEnum {
    public static readonly identifier = "allEnchantment"
    public static options = EnchantmentHandler.keys.concat(Object.keys(Enchantment).filter(k => isNaN(Number(k))))
}

export { AllEnchantEnum };