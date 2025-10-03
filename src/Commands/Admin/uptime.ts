import { Player } from "@serenityjs/core"
import { CommandBuilder, CommandOverload } from "../../Classes"
import { Server } from "../../server"
import { Utils } from "../../Utils"
import { cpuUsage, hrtime } from "node:process";

export async function calculateCpuUsage(sampleIntervalMs: number = 1000): Promise<number> {
    // Get initial CPU usage.
    const startUsage = cpuUsage();
    const startHrTime = hrtime.bigint();

    // Wait over sample interval.
    await new Promise(resolve => setTimeout(resolve, sampleIntervalMs));

    // Get final CPU usage and high-resolution real time.
    const endUsage = cpuUsage();
    const endHrTime = hrtime.bigint();

    const elapsedTime = Number(endHrTime - startHrTime) / 1000;

    // Calculate the elapsed CPU time in microseconds.
    const elapsedUsage = (endUsage.user - startUsage.user) + (endUsage.system - startUsage.system);

    // Calculate the percentage of CPU time used during the interval.
    const cpuPercentage = (100 * elapsedUsage) / elapsedTime;

    return cpuPercentage;
}

new CommandBuilder("uptime", "Shows statistics for the server's uptime.")
    .setAliases(["performance"])
    .setPermissions(["serenity.operator"])
    .addOverload(
        new CommandOverload({
        }).onCallback((origin) => {

            if (origin instanceof Player) {
                origin.info("§7§oLogging server performance...")
            } else {
                Server.logger.info("Logging server performance...")
            }

            calculateCpuUsage().then((cpu) => {
                const message = `§6§l=== Server Uptime ===§r
§fUptime: §e${Utils.formatDuration(Math.floor(process.uptime()))}
§fMemory Usage: §c${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${(process.availableMemory() / 1024 / 1024).toFixed(2)} MB
§fCPU Usage: §6${(cpu).toFixed(2)}§e%%
§fTPS: §b${Server.instance.tps}
`
                if (origin instanceof Player) {
                    origin.sendMessage(message)
                } else {
                    Server.logger.info(message.replace(/%%/g, "%"))
                }
            })
        })
    ).register("Admin")