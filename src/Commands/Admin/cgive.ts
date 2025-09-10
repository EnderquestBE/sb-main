import { EntityInventoryTrait, IntegerEnum, ItemStack, Player, StringEnum } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes/classes";

new CommandBuilder("cgive", "Gives an unrestricted itemstack.")
    .setPermissions(["serenity.operator"])
    .addOverload(
        new CommandOverload({
            type: StringEnum,
            amount: IntegerEnum
        }).onCallback((origin, { type, amount }) => {
            if (!(origin instanceof Player)) return { message: "You must be a player to use this command." }
            try {
                const item = new ItemStack(type.result!, { stackSize: amount.result! })
                origin.getTrait(EntityInventoryTrait).container.addItem(item)
            } catch (error) {
                origin.error("Failed to construct item.");
            }
        })
    ).register("Admin");
