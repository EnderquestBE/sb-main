import { PERMISSION_INTEGER } from "../config";

const STAFF_PERMISSIONS = new Map<PERMISSION_INTEGER, string[]>([
    [PERMISSION_INTEGER.OWNER, ["mod.forcerename", "mod.broadcast", "mod.cooldown", "mod.kitcooldown"]],
])

export { STAFF_PERMISSIONS };