import { Block, BlockSignTrait, ItemType, Player, PlayerCommandExecutorTrait, PlayerInteractWithBlockSignal } from "@serenityjs/core";
import { Vendor } from "../../Classes/Data/Vendor";
import { ByteTag, CompoundTag, IntTag, StringTag } from "@serenityjs/nbt";
import { Utils } from "../../Utils/utils";
import { PlayerDatabase, PlayerSession } from "../../Classes/classes";

const purchaseConfirmation = new Map<string, { timestamp: number }>();

class SignHandler {
    public static onInteract({ source, block }: PlayerInteractWithBlockSignal) {
        const sign = block.getTrait(BlockSignTrait);
        if (!sign) return false
        const text = sign.getFrontText()
        const parts = text.split("\n")

        const nbt = block.getStorage()

        // Sign is already initialized as a special type.
        if (nbt.get<ByteTag>("Locked")) {
            const command = nbt.get<StringTag>("Command")
            if (command) {
                source.executeCommand(command.valueOf())
            }
            if (nbt.get<CompoundTag>("Shop")) {
                this.interactShop(source, block)
            }
            // Check if the sign should be initialized.
        } else {
            // Command sign functionality.
            if (text.startsWith("/")) {
                try {
                    if (!source.getTrait(PlayerCommandExecutorTrait).hasCommand(text.split(" ")[0]!.slice(1))) {
                        source.error("Unknown command executed. Please make sure the command exists, and that you have permission to use it.")
                        return
                    }
                    source.executeCommand(text)
                    block.getStorage().set("Locked", new ByteTag(1, "Locked"));
                    block.getStorage().set("Command", new StringTag(text, "Command"))
                    const frontText = block.getStorage().get<CompoundTag>("FrontText")!;
                    frontText.set("Text", new StringTag(`§a${text}`, "Text"));
                    block.sendStorageUpdate()
                    source.info("§eSign command created successfully!")
                } catch (e) {
                    source.error("Failed to create sign command.")
                    return
                }
            }
            // Other functionality.
            else switch (parts[0]!.toLowerCase()) {
                case "[shop]":
                    this.initializeShop(source, block, parts)
                    break
            }
        }
    }

    public static initializeShop(player: Player, block: Block, text: string[]) {
        const price = parseInt(text[1] ?? "")
        const itemRaw = (text[2] ?? "")
        const amount = parseInt(text[3] ?? "1")
        if (isNaN(price) || !itemRaw || isNaN(amount)) {
            player.error("Invalid shop sign format.\n§b[shop]\n§eItem ID\nItem Amount\nPrice");
            return
        }

        if (amount > 64 || amount < 1) {
            player.error("Amount must be within range §e1 §cto §e64§c.")
            return
        }

        const itemId = ItemType.get(itemRaw.indexOf(":") === -1 ? `minecraft:${itemRaw}` : itemRaw)?.identifier
        if (!itemId) {
            player.error("Invalid Item ID.");
            return
        }

        // Lock sign so it cannot be modified.
        block.getStorage().set("Locked", new ByteTag(1, "Locked"));

        // Set shop NBT to sign.
        const shopTag = new CompoundTag("Shop")

        const ownerTag = new CompoundTag("ShopOwner")
        ownerTag.push(new StringTag(player.username, "Username"))
        ownerTag.push(new StringTag(player.xuid, "XUID"))

        shopTag.push(ownerTag)
        shopTag.push(new StringTag(itemId, "Item"))
        shopTag.push(new IntTag(amount, "Amount"))
        shopTag.push(new IntTag(price, "Price"))

        // Format sign text.
        const frontText = block.getStorage().get<CompoundTag>("FrontText")!;
        frontText.set("Text", new StringTag([
            `§b${player.username}`,
            `§ePrice: §6$${price}`,
            `§a${Utils.formatString(itemId)}`,
            `§eAmount: §7x§c${amount}`
        ].join("\n"), "Text"));

        block.getStorage().set("Shop", shopTag)

        // Update NBT.
        block.sendStorageUpdate()

        // Send success.
        player.info(`§eShop creation successful! Selling §a${Utils.formatString(itemId)} §7x§c${amount} for §6$${price}§e.`)
    }

    public static async interactShop(player: Player, block: Block) {
        const shopData = block.getStorage().get<CompoundTag>("Shop")
        if (!shopData) {
            player.error("Failed to interact with shop.")
            return
        }

        const vendorData = shopData.get<CompoundTag>("ShopOwner")!
        const vendorUser = { username: vendorData.get<StringTag>("Username")?.valueOf()!, xuid: vendorData.get<StringTag>("XUID")?.valueOf()! }
        const vendorItem = shopData.get<StringTag>("Item")?.valueOf()!
        const vendorAmount = shopData.get<IntTag>("Amount")?.valueOf()!
        const vendorPrice = shopData.get<IntTag>("Price")?.valueOf()!

        if (vendorUser.xuid === player.xuid) {
            player.error("You cannot buy from your own shop!")
            return
        }

        const confirmationKey = `${player.xuid}-${block.position.x}-${block.position.y}-${block.position.z}`;
        const lastPurchase = purchaseConfirmation.get(confirmationKey);

        const now = Date.now()
        if (lastPurchase && now - lastPurchase.timestamp < 5000 && now - lastPurchase.timestamp > 200) {
            const sellerVendor = await Vendor.load(vendorUser.xuid);
            let sellerSession: PlayerSession | null
            const sellerPlayer = block.world.serenity.getPlayerByXuid(vendorUser.xuid)
            if (sellerPlayer) {
                sellerSession = sellerPlayer.session()
            } else {
                sellerSession = await PlayerSession.load(vendorUser.xuid, PlayerDatabase.instance);
            }
            const buyerSession = player.session();

            if (!sellerVendor) {
                player.error("This shop is currently inactive, seller needs to set up a §6vendor §caccount.")
                return
            }

            if (!buyerSession || !sellerSession) {
                player.error("Transaction failed. Try again later.")
                return
            }

            if (!sellerVendor.hasItemStock(vendorItem, vendorAmount)) {
                if (sellerPlayer) sellerPlayer.info(`§cYour §a${Utils.formatString(vendorItem)} §cshop on island §e${block.world.identifier.substring(3)} §cis out of stock.`)
                return player.error("This shop is out of stock. Come back later!");
            }
            if (buyerSession.getMoney() < vendorPrice) {
                return player.error("You cannot afford this item.");
            }

            await sellerVendor.removeStock(vendorItem, vendorAmount);
            await buyerSession.removeMoney(vendorPrice);
            player.inventory.giveItem(vendorItem, vendorAmount)

            await sellerSession.addMoney(vendorPrice);
            if (sellerPlayer) sellerPlayer.info(`§b${player.username} §epurchased §7x§c${vendorAmount} §a${Utils.formatString(vendorItem)} §efrom your shop for §6$${Utils.formatInt(vendorPrice)}§e.`);
            player.info(`§eSuccessfully purchased §a${Utils.formatString(vendorItem)} §7x§c${vendorAmount} §efor §6$${Utils.formatInt(vendorPrice)}§e.`);
            purchaseConfirmation.delete(confirmationKey);

        } else {
            player.info("§6Tap the sign again to confirm.");
            purchaseConfirmation.set(confirmationKey, {
                timestamp: Date.now()
            });
        }
    }
}

export { SignHandler };