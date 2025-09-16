import { CustomEnum, IntegerEnum, ItemEnum, ItemType, Player, StringEnum } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes/classes";
import { Vendor } from "../../Classes/Data/Vendor";
import { Utils } from "../../Utils/utils";

class VendorActionEnum extends CustomEnum {
    public static readonly identifier = "vendorAction"
    public static options = ["stock", "unstock"]
}

class VendorListEnum extends CustomEnum {
    public static readonly identifier = "vendorList"
    public static options = ["list"]
}

const bridgeTop = "-".repeat(20)
const bridgeBottom = "-".repeat(51)

new CommandBuilder("vendor", "Manage your vendor stock.")
    .addOverload(
        new CommandOverload({
            list: VendorListEnum
        }).onCallback((origin) => {
            if (!(origin instanceof Player)) return;
            const player = origin

            Vendor.load(player.xuid).then((vendor) => {
                if (!vendor) {
                    player.error("§cYou do not have a §6vendor §caccount. Stock your first item create one.")
                    return
                }
                const stock = vendor.getStock()
                player.sendMessage(`§a${bridgeTop} §eYOUR STOCK §a${bridgeTop}`)
                for (const item of stock) {
                    player.sendMessage(`§f- §d${Utils.formatString(item.identifier)} §7x§c${item.amount}`)
                }
                player.sendMessage("§a" + bridgeBottom)
            })
        })
    )
    .addOverload(
        new CommandOverload({
            action: VendorActionEnum,
            item: ItemEnum,
            amount: IntegerEnum
        }).onCallback((origin, { action, item, amount }) => {
            if (!(origin instanceof Player)) return;
            const player = origin

            Vendor.load(player.xuid).then(async (vendor) => {
                const itemRaw = item.result as string
                const itemId = ItemType.get(itemRaw.indexOf(":") === -1 ? `minecraft:${itemRaw}` : itemRaw)?.identifier
                const itemAmount = amount.result
                if (!itemId) {
                    player.error("Invalid item ID.")
                    return
                }
                if (!itemAmount) {
                    player.error("Invalid amount.")
                    return
                }

                if (!vendor) {
                    vendor = await Vendor.createDefault(player.xuid)
                }

                const type = action.result

                if (type === "stock") {
                    const invAmount = player.inventory.getItemCount(itemId)
                    if (invAmount < itemAmount) {
                        player.error("You cannot afford to stock this amount.")
                        return
                    }
                    player.inventory.clearItem(itemId, itemAmount)
                    await vendor.addStock(itemId, itemAmount)
                    player.info(`§eStocked §d${Utils.formatString(itemId)} §7x§c${itemAmount} §eto your vendor account.`)
                } else if (type === "unstock") {
                    const vendorAmount = Math.min((vendor.getItemStock(itemId)?.amount ?? 0), itemAmount)
                    if (vendorAmount === 0) {
                        player.error("You do not have any stock of this item.")
                        return
                    }
                    if ((await vendor.removeStock(itemId, vendorAmount)).success) {
                        player.inventory.giveItem(itemId, vendorAmount)
                        player.info(`§6Unstocked §d${Utils.formatString(itemId)} §7x§c${vendorAmount} §6from your vendor account.`)
                    }
                }
            })
        })
    )
    .register("General");