import { MessageForm, Player } from "@serenityjs/core"
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

function showUptimeMessage(uptime: string, memoryUsed: string, memoryTotal: string, cpu: string, tps: number) {
    const message = `§fUptime: §e${uptime}\n§fMemory Usage: §c${memoryUsed} MB / ${memoryTotal} MB\n§fCPU Usage: §6${cpu}§e%%%%\n§fTPS: §b${tps}`
    return message;
}

new CommandBuilder("uptime", "Shows statistics for the server's uptime.")
    .setAliases(["performance"])
    .setPermissions(["serenity.operator"])
    .addOverload(
        new CommandOverload({
        }).onCallback((origin) => {

            if (origin instanceof Player) {

                const cpuReadings: number[] = [];
                const maxReadings = 5;

                const form = new MessageForm("Server Uptime");
                form.content = "Logging server performance...";
                const intervalId = setInterval(() => {
                    calculateCpuUsage().then((cpu) => {
                        cpuReadings.push(cpu);

                        if (cpuReadings.length > maxReadings) {
                            cpuReadings.shift();
                        }
                        const sum = cpuReadings.reduce((a, b) => a + b, 0);
                        const averageCpu = sum / cpuReadings.length;

                        form.content = showUptimeMessage(
                            Utils.formatDuration(Math.floor(process.uptime())),
                            (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
                            (process.constrainedMemory() / 1024 / 1024).toFixed(2),
                            averageCpu.toFixed(2),
                            Server.instance.tps
                        );

                        form.update(origin);
                    });
                }, 1000);
                form.show(origin, () => {
                    clearInterval(intervalId);
                })
            } else {
                Server.logger.info("Logging server performance...")
                calculateCpuUsage().then((cpu) => {
                    Server.logger.info("\n§6§l=== Server Uptime ===§r\n" + showUptimeMessage(Utils.formatDuration(Math.floor(process.uptime())), (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2), (process.constrainedMemory() / 1024 / 1024).toFixed(2), (cpu).toFixed(2), Server.instance.tps).replace("%%%%", "%"))
                })
            }
        })
    ).register("Admin")