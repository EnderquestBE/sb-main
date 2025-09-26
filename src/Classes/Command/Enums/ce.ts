import { CustomEnum } from "@serenityjs/core";

class CustomEnchantEnum extends CustomEnum {
    public static readonly identifier = "customEnchantment"
    public static options: string[] = [];
}

export { CustomEnchantEnum };