import { ActionForm, ModalForm, Player, StringEnum } from "@serenityjs/core";
import { CommandBuilder, CommandOverload, Island } from "../../Classes";
// Make sure to import Island and StringEnum

new CommandBuilder("islandadmin", "Manages an island's data.")
    .setPermissions(["serenity.operator"])
    .addOverload(
        new CommandOverload({
            name: StringEnum
        }).onCallback((executor, { name }) => {
            if (!(executor instanceof Player)) return;

            const islandName = name.result as string;
            if (!islandName) return;

            const island = Island.loadSync(islandName);
            if (!island) {
                return executor.error("Island does not exist.");
            }

            const methods: { name: string, func: Function }[] = [];
            for (const propertyName of Object.getOwnPropertyNames(Object.getPrototypeOf(island))) {
                const property = (island as any)[propertyName];
                if (typeof property === 'function' && propertyName !== 'constructor') {
                    methods.push({ name: propertyName, func: property });
                }
            }

            const handleExecution = (method: { name: string, func: Function }) => {
                const functionToCall = method.func;
                const requiredArgCount = functionToCall.length;
                const functionString = functionToCall.toString();
                const argumentNames = functionString.match(/\(([^)]*)\)/)![1]!
                    .split(',')
                    .map(param => param.trim())
                    .filter(param => param.length > 0);

                if (requiredArgCount === 0) {
                    try {
                        const returnValue = functionToCall.call(island);
                        executor.info(`§aExecuted §e${method.name}() §aon island §e${islandName}§a.`);
                        if (returnValue !== undefined) {
                            const output = typeof returnValue === 'object' ? JSON.stringify(returnValue) : String(returnValue);
                            executor.info(`§f> §7Output: §f${output}`);
                        }
                    } catch (e) {
                        console.error(e);
                        executor.error(`Failed to execute on island ${islandName}: ${(e as Error).message}`);
                    }
                    return;
                }

                const argsForm = new ModalForm(`${method.name}()`);
                for (let i = 0; i < requiredArgCount; i++) {
                    argsForm.input(argumentNames[i]!, "Enter value...");
                }

                argsForm.show(executor, (result, error) => {
                    if (result === null || error) return;
                    const parsedArgs = (result as string[]).map(arg => {
                        const num = Number(arg);
                        return isNaN(num) || arg.trim() === '' ? arg : num;
                    });

                    try {
                        const returnValue = functionToCall.apply(island, parsedArgs);
                        executor.info(`§aExecuted §e${method.name}() §aon island §e${islandName}§a.`);
                        if (returnValue !== undefined) {
                            const output = typeof returnValue === 'object' ? JSON.stringify(returnValue) : String(returnValue);
                            executor.info(`§f↪ §7Return Value: §b${output}`);
                        }
                    } catch (e) {
                        executor.error(`An error occurred: ${(e as Error).message}`);
                    }
                });
            };

            const form = new ActionForm("Island Admin");
            form.content = "Select a method to execute.";
            form.button("§9Search for Method");
            for (const method of methods) {
                form.button(`${method.name} (args: ${method.func.length})`);
            }

            form.show(executor, (result, error) => {
                if (result === null || error) return;
                if (result === 0) {
                    const searchForm = new ModalForm("Search Method");
                    searchForm.input("Name", "e.g. 'getPoints'");
                    searchForm.show(executor, (searchResult, searchError) => {
                        if (searchResult === null || searchError) return;
                        const methodName = (searchResult[0] as string).trim();
                        const foundMethod = methods.find(m => m.name === methodName);

                        if (foundMethod) {
                            handleExecution(foundMethod);
                        } else {
                            executor.error(`Method '${methodName}' is invalid.`);
                        }
                    });
                    return;
                }
                const selectedMethod = methods[result - 1]!;
                handleExecution(selectedMethod);
            });
        })
    )
    .register("General");