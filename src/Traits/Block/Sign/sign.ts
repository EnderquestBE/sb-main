import {
    Block,
    BlockIdentifier,
    BlockInteractionOptions,
    BlockSignTrait,
    BlockTrait,
    ItemType,
    ItemTypeBlockPlacerComponent,
    Player,
    PlayerCommandExecutorTrait,
} from "@serenityjs/core";
import { ByteTag, CompoundTag, IntTag, StringTag } from "@serenityjs/nbt";
import { Utils } from "../../../Utils/utils";
import { PlayerDatabase, PlayerSession, Vendor } from "../../../Classes";

const purchaseConfirmation = new Map<string, { timestamp: number }>();

class BlockSpecialSignTrait extends BlockTrait {
    public static readonly identifier: string = "special_sign";
    public static readonly types: Array<BlockIdentifier> = [
        BlockIdentifier.StandingSign,
        BlockIdentifier.WallSign
    ];

    public constructor(block: Block) {
        super(block);
    }

    public onInteract({ origin: player, }: BlockInteractionOptions): boolean {
        if (!player) return false;
        if (player.isSneaking && player.getHeldItem()?.hasComponent(ItemTypeBlockPlacerComponent)) return true;
        const sign = this.block.getTrait(BlockSignTrait);
        if (!sign) return false
        const text = sign.getFrontText()
        const parts = text.split("\n")

        const nbt = this.block.getStorage()

        // Sign is already initialized as a special type.
        if (nbt.get<ByteTag>("Locked")) {
            const command = nbt.get<StringTag>("Command")
            if (command) {
                player.executeCommand(command.valueOf())
            }
            if (nbt.get<CompoundTag>("Shop")) {
                BlockSpecialSignTrait.interactShop(player, this.block)
            }
            // Check if the sign should be initialized.
        } else {
            // Command sign functionality.
            if (text.startsWith("/")) {
                try {
                    if (!player.getTrait(PlayerCommandExecutorTrait).hasCommand(text.split(" ")[0]!.slice(1))) {
                        player.error("Unknown command executed. Please make sure the command exists, and that you have permission to use it.")
                        return false;
                    }
                    player.executeCommand(text)
                    this.block.getStorage().set("Locked", new ByteTag(1, "Locked"));
                    this.block.getStorage().set("Command", new StringTag(text, "Command"))
                    const frontText = this.block.getStorage().get<CompoundTag>("FrontText")!;
                    frontText.set("Text", new StringTag(`§a${text}`, "Text"));
                    this.block.sendStorageUpdate()
                    player.info("§eSign command created successfully!")
                } catch (e) {
                    player.error("Failed to create sign command.")
                    return false;
                }
            }
            // Other functionality.
            else switch (parts[0]!.toLowerCase()) {
                case "[shop]":
                    BlockSpecialSignTrait.initializeShop(player, this.block, parts)
                    break
            }
        }
        return false;
    }

    private static initializeShop(player: Player, block: Block, text: string[]) {
        const itemRaw = (text[1] ?? "")
        const amount = parseInt(text[2] ?? "1")
        const price = parseInt(text[3] ?? "")
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

    private static async interactShop(player: Player, block: Block) {
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

export { BlockSpecialSignTrait };