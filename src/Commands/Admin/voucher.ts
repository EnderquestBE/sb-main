import { CustomEnum, IntegerEnum, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload, ItemVoucher, MoneyVoucher, VanityEnum, VanityVoucher, XPVoucher } from "../../Classes";

class IntVoucherTypeEnum extends CustomEnum {
    public static readonly identifier = "IntVoucherTypeEnum";
    public static options = ["money", "xp"];
}

new CommandBuilder("voucher", "Creates a voucher item.")
    .setPermissions(["serenity.operator"])
    .addOverload(
        new CommandOverload({
            type: IntVoucherTypeEnum,
            value: IntegerEnum,
            amount: [IntegerEnum, true],
        }).onCallback((player, { type, value: valueRaw, amount: amountRaw }) => {
            if (!(player instanceof Player)) return;

            const voucherType = type.result as string;
            const value = valueRaw.result;
            //@ts-ignore
            const amount = amountRaw?.result ?? 1;

            if (value === null || value < 1) {
                return player.error("Value must be at least 1.");
            }

            if (amount < 1) {
                return player.error("Amount must be at least 1.");
            }

            let VoucherItem: ItemVoucher | null = null;

            switch (voucherType) {
                case "money":
                    VoucherItem = new MoneyVoucher(value, amount);
                    break;
                case "xp":
                    VoucherItem = new XPVoucher(value, amount);
                    break;
                default:
                    return player.error("Invalid voucher type.");
            }

            if (VoucherItem) {
                player.inventory.addItem(VoucherItem);
                player.info(`§aGave you §e${amount}x ${VoucherItem.getDisplayName()}§a.`);
            }
        })
    )
    .addOverload(
        new CommandOverload({
            value: VanityEnum,
            amount: [IntegerEnum, true],
        }).onCallback((player, { value: valueRaw, amount: amountRaw }) => {
            if (!(player instanceof Player)) return;

            const value = valueRaw.result as string;
            //@ts-ignore
            const amount = amountRaw?.result ?? 1;

            if (amount < 1) {
                return player.error("Amount must be at least 1.");
            }

            const VoucherItem = new VanityVoucher(value, amount);

            if (VoucherItem) {
                player.inventory.addItem(VoucherItem);
                player.info(`§aGave you §e${amount}x ${VoucherItem.getDisplayName()}§a.`);
            }
        })
    )
    .register("Admin");
