import { Island } from "../../Classes";
import { Utils } from "../../Utils/utils";
import { ServerTaskHandler } from "../Server/handler";
import { IslandLimitUnlocks } from "./limits";

export class Expansion {
    public static readonly SIZE_INCREASE = 10;
    public static readonly SIZE_MAXIMUM = 500
    public static readonly LEVEL_MINIMUM = 15;
    public static readonly LEVEL_INTERVAL = 5;

    public static getLevelRequirement(size: number): number {
        return this.LEVEL_INTERVAL * Math.floor((size - 10) / this.SIZE_INCREASE) + this.LEVEL_MINIMUM;
    }

    public static getUpgradeCost(size: number): number {
        return 150000 + 30000 * ((size - 10) / this.SIZE_INCREASE);
    }

    public static async expand(island: Island) {
        // Get island size.
        const size = island.getSize()

        // Get all currently online owners.
        const owners = island.getOnlineOwners();
        if (owners.length === 0) return;

        // Withdraw island funds.
        const withdraw = await island.withdrawFromBank(
            this.getUpgradeCost(size),
            `Expanded island from size §f${size} §7to §d${size + this.SIZE_INCREASE}§7.`
        );
        if (!withdraw.success) {
            for (const owner of owners) {
                owner.error("Failed to expand island: " + withdraw.reason!)
            }
            return
        }
        // Increase the size of the island.
        island.increaseSize(this.SIZE_INCREASE)
        // Set island limits.
        const changes = IslandLimitUnlocks.update(island, true)

        // Show expansion message.
        for (const owner of owners) {
            ServerTaskHandler.queueTask(() => {
                owner.info(`§eYour island's size has been increased for §6$${Utils.formatInt(this.getUpgradeCost(size))}§e! §6New Size - §d${island.getSize()}`)
                ServerTaskHandler.queueTask(() => {
                    let i = 0;
                    for (const key in changes) {
                        ServerTaskHandler.queueTask(() => {
                            //@ts-ignore
                            owner.info(`§7» §b${key}§e limit has been increased to §d${changes[key]}§e.`)
                        }, i)
                        i += 1250
                    }
                }, 1500);
            }, 500);
        }
    }
}