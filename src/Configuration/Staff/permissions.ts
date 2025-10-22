import { PERMISSION_INTEGER } from "../config";

const STAFF_PERMISSIONS = new Map<PERMISSION_INTEGER, string[]>([
    [PERMISSION_INTEGER.OWNER, ["mod.forcerename", "mod.broadcast", "mod.cooldown", "mod.kitcooldown", "mod.vanity", "mod.addmultiplier", "mod.managemultipliers"]],
])

export { STAFF_PERMISSIONS };