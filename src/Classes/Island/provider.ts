import { FileSystemProvider, Serenity } from "@serenityjs/core";
import { ServerTaskHandler } from "../../Handlers";
import { IslandGenerator } from "./generator";

class IslandProvider extends FileSystemProvider {
    public static readonly identifier: string = "island";

    public static initialize(serenity: Serenity): Promise<void> {
        ServerTaskHandler.queueTask(() => {
            //@ts-ignore
            FileSystemProvider.loadWorld(serenity, "../worlds/default");
            IslandGenerator.registerStructure(serenity.getWorld());
        }, 100);
        return Promise.resolve();
    }
}

export { IslandProvider };