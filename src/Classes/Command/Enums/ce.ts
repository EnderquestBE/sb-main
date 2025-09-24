import { CustomEnum } from "@serenityjs/core";
import { EnchantmentHandler } from "../../../Handlers/Enchantment/handler";

class CustomEnchantEnum extends CustomEnum {
    public static readonly identifier = "customEnchantment"
    public static options = EnchantmentHandler.keys;
}

export { CustomEnchantEnum };