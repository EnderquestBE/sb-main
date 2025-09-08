import { Vector3f } from "@serenityjs/protocol"

type ServerWarp = {
    name: string,
    world: string
    location: Vector3f,
    commandAliases?: string[]
}

export type { ServerWarp }