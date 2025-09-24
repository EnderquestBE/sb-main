import { Filter, IslandDatabase } from "../../Classes";

async function validifyIslandName(name: string, db: IslandDatabase): Promise<{ success: boolean, message?: string }> {
  if (await db.get(name)) {
    return { success: false, message: "That island name is already taken!" }
  } else if (Filter.contains(name)) {
    return { success: false, message: "Island name contains a banned word." }
  } else if (name.length < 4) {
    return { success: false, message: "Your island name must be at least 4 characters long." }
  } else if (name.length > 14) {
    return { success: false, message: "Your island name must be less than 14 characters long." }
  } else if (/^[a-zA-Z0-9]+$/.test(name) === false) {
    return { success: false, message: "Your island name must only contain letters." }
  }
  return {
    success: true
  }
}

export { validifyIslandName }