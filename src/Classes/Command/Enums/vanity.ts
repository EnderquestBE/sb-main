import { CustomEnum } from "@serenityjs/core";
import { VanityItems } from "../../../Configuration/Vanity";

class VanityEnum extends CustomEnum {
    public static readonly identifier = "vanityId"
    public static options = VanityItems.keys().toArray();
}

export { VanityEnum }