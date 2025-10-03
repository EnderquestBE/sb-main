import { MorphManager } from "../../Classes/Morph";
import { ImposterGeometry } from "./Geometry/imposter";
import { PalmGeometry } from "./Geometry/palm";
import { PigGeometry } from "./Geometry/pig";
import { SpongebobGeometry } from "./Geometry/spongebob";

MorphManager.registerMorph({
    identifier: "spongebob",
    texture: "spongebob.png",
    skinOptions: { geometry: SpongebobGeometry, geometryKey: "geometry.spongebob", isPersona: true, width: 256, height: 256 }
})

MorphManager.registerMorph({
    identifier: "imposter",
    texture: "imposter.png",
    skinOptions: { geometry: ImposterGeometry, geometryKey: "geometry.imposter" }
})

MorphManager.registerMorph({
    identifier: "palm",
    texture: "top_hat_chicken_shirt.png",
    skinOptions: { geometry: PalmGeometry, geometryKey: "geometry.palm" }
})

MorphManager.registerMorph({
    identifier: "pig",
    texture: "pig.png",
    skinOptions: { geometry: PigGeometry, geometryKey: "geometry.pig" }
})