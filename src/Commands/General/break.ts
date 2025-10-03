import { Block, BlockIdentifier, BlockPermutation, ItemIdentifier, Player } from "@serenityjs/core";
import { CommandBuilder, CommandOverload } from "../../Classes";

new CommandBuilder("break", "Break the bedrock you are looking at.")
    .setAliases(["breaker"])
    .addOverload(
        new CommandOverload({}).onCallback((player) => {
            if (!(player instanceof Player)) return;

            //@ts-ignore
            const block: Block | null = player.getBlockFromViewDirection();
            if (!block) {
                return player.error("You must look at the block you want to break.");
            }

            if (block.identifier !== BlockIdentifier.Bedrock) {
                return player.error("You must look at bedrock to break it.");
            }

            const island = player.getIsland();

            if (!island || !island.isOwner(player.xuid)) {
                return player.error("You do not have permission to break bedrock here.");
            }

            const spawn = island.getSpawn();

            if (block.position.distance(spawn) < 10) {
                return player.error("You cannot break bedrock that close to the island spawn.");
            }

            block.setPermutation(BlockPermutation.resolve(BlockIdentifier.Air));
            player.inventory.giveItem(ItemIdentifier.Bedrock, 1)

            player.info("§eBedrock broken!");
        })
    )
    .register("General");