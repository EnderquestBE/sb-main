import { Container, EntityEquipmentTrait, ItemStack, Player } from "@serenityjs/core";
import { CompoundTag, IntTag, ListTag } from "@serenityjs/nbt";
import { EquipmentSlot, MobArmorEquipmentPacket } from "@serenityjs/protocol";
import { ServerTaskHandler } from "../Handlers";

function checkWhileEquipped(this: EntityEquipmentTrait, item: ItemStack, slot: EquipmentSlot) {
    if (this.entity.isPlayer()) {
        const enchantments = item.getCustomEnchantments();
        if (enchantments) {
            for (const { level, info } of enchantments) {
                if (!info) return;
                const chance = info.activationChance;
                if (!info.whileEquipped) continue;
                const delay = 1000 * Math.max(chance.base - (level * chance.perLevel), chance.minimum);
                const callback = () => {
                    info.whileEquipped?.({ player: this.entity as Player, item, level });
                    (this.entity as Player).whileEquippedCheck[slot] = ServerTaskHandler.queueTask(callback, delay);
                }
                this.entity.whileEquippedCheck[slot] = ServerTaskHandler.queueTask(callback, delay);
            }
        }
    }
}

EntityEquipmentTrait.prototype.onContainerUpdate = function onContainerUpdate(container: Container): void {
    // Check if the container is not the armor or offhand container
    if (container !== this.armor && container !== this.offhand) return;

    // Create a new list tag for the armor items
    const armor = new ListTag<CompoundTag>([], "Armor");

    const head = this.armor.getItem(EquipmentSlot.Head);
    const chest = this.armor.getItem(EquipmentSlot.Chest);
    const legs = this.armor.getItem(EquipmentSlot.Legs);
    const feet = this.armor.getItem(EquipmentSlot.Feet);
    const offhand = this.offhand.getItem(0);

    // Check if the head item is not null
    if (head) {
        // Get the level storage of the head item
        const headStorage = head.getLevelStorage();

        // Create a new int tag for the head slot
        headStorage.add(new IntTag(EquipmentSlot.Head, "Slot"));

        // Push the head storage to the armor list
        armor.push(headStorage);

        // Check for custom enchantments with whileEquipped effect
        checkWhileEquipped.call(this, head, EquipmentSlot.Head);
    } else {
        // Stop whileOnEquipped check
        if (this.entity.isPlayer() && this.entity.whileEquippedCheck[EquipmentSlot.Head]) {
            clearTimeout(this.entity.whileEquippedCheck[EquipmentSlot.Head]!);
            this.entity.whileEquippedCheck[EquipmentSlot.Head] = null;
        }
    }

    // Check if the chest item is not null
    if (chest) {
        // Get the level storage of the chest item
        const chestStorage = chest.getLevelStorage();

        // Create a new int tag for the chest slot
        chestStorage.add(new IntTag(EquipmentSlot.Chest, "Slot"));

        // Push the chest storage to the armor list
        armor.push(chestStorage);

        // Check for custom enchantments with whileEquipped effect
        checkWhileEquipped.call(this, chest, EquipmentSlot.Chest);
    } else {
        // Stop whileOnEquipped check
        if (this.entity.isPlayer() && this.entity.whileEquippedCheck[EquipmentSlot.Chest]) {
            clearTimeout(this.entity.whileEquippedCheck[EquipmentSlot.Chest]!);
            this.entity.whileEquippedCheck[EquipmentSlot.Chest] = null;
        }
    }

    // Check if the legs item is not null
    if (legs) {
        // Get the level storage of the legs item
        const legsStorage = legs.getLevelStorage();

        // Create a new int tag for the legs slot
        legsStorage.add(new IntTag(EquipmentSlot.Legs, "Slot"));

        // Push the legs storage to the armor list
        armor.push(legsStorage);

        // Check for custom enchantments with whileEquipped effect
        checkWhileEquipped.call(this, legs, EquipmentSlot.Legs);
    } else {
        // Stop whileOnEquipped check
        if (this.entity.isPlayer() && this.entity.whileEquippedCheck[EquipmentSlot.Legs]) {
            clearTimeout(this.entity.whileEquippedCheck[EquipmentSlot.Legs]!);
            this.entity.whileEquippedCheck[EquipmentSlot.Legs] = null;
        }
    }

    // Check if the feet item is not null
    if (feet) {
        // Get the level storage of the feet item
        const feetStorage = feet.getLevelStorage();

        // Create a new int tag for the feet slot
        feetStorage.add(new IntTag(EquipmentSlot.Feet, "Slot"));

        // Push the feet storage to the armor list
        armor.push(feetStorage);

        // Check for custom enchantments with whileEquipped effect
        checkWhileEquipped.call(this, feet, EquipmentSlot.Feet);
    } else {
        // Stop whileOnEquipped check
        if (this.entity.isPlayer() && this.entity.whileEquippedCheck[EquipmentSlot.Feet]) {
            clearTimeout(this.entity.whileEquippedCheck[EquipmentSlot.Feet]!);
            this.entity.whileEquippedCheck[EquipmentSlot.Feet] = null;
        }
    }

    // Set the armor list to the entity's nbt
    this.entity.addStorageEntry(armor);

    // Create a new MobArmorEquipmentPacket, and assign the equipment properties
    const packet = new MobArmorEquipmentPacket();
    packet.runtimeId = this.entity.runtimeId;
    packet.helmet = ItemStack.toNetworkStack(head ?? ItemStack.empty());
    packet.chestplate = ItemStack.toNetworkStack(chest ?? ItemStack.empty());
    packet.leggings = ItemStack.toNetworkStack(legs ?? ItemStack.empty());
    packet.boots = ItemStack.toNetworkStack(feet ?? ItemStack.empty());
    packet.body = ItemStack.toNetworkStack(offhand ?? ItemStack.empty());

    // Broadcast the packet to the dimension of the entity
    this.entity.dimension.broadcast(packet);
}