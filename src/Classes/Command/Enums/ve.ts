import { CustomEnum } from "@serenityjs/core";
import { Enchantment } from "@serenityjs/protocol";

class VanillaEnchantEnum extends CustomEnum {
    public static readonly identifier = "vanillaEnchantment";
    public static options = Object.keys(Enchantment).filter(k => isNaN(Number(k)));
}

export { VanillaEnchantEnum };