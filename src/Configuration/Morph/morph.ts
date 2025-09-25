import { MorphManager } from "../../Classes/Morph";
import { ImposterGeometry } from "./Geometry/imposter";
import { PalmGeometry } from "./Geometry/palm";
import { PigGeometry } from "./Geometry/pig";
import { SpongebobGeometry } from "./Geometry/spongebob";

MorphManager.registerMorph({
    identifier: "spongebob",
    skinURL: "https://drive.usercontent.google.com/u/0/uc?id=1Is1xsxshdxDsOmpG5HWhKsIzx1XmDwjy&export=download",
    skinOptions: { geometry: SpongebobGeometry, geometryKey: "geometry.spongebob" }
})

MorphManager.registerMorph({
    identifier: "imposter",
    skinURL: "https://drive.usercontent.google.com/u/0/uc?id=1T3kBk779Vrc25rsWgk_CuB-eFcQ0du9L&export=download",
    skinOptions: { geometry: ImposterGeometry, geometryKey: "geometry.imposter" }
})

MorphManager.registerMorph({
    identifier: "palm",
    skinURL: "https://drive.usercontent.google.com/u/0/uc?id=17zRczizNhS5sMMKXjZcS0MmweU9DB1em&export=download",
    skinOptions: { geometry: PalmGeometry, geometryKey: "geometry.palm" }
})

MorphManager.registerMorph({
    identifier: "pig",
    skinURL: "https://drive.usercontent.google.com/u/0/uc?id=1MCJmyN_IFX370LRUDyP0qSmh16wyRieX&export=download",
    skinOptions: { geometry: PigGeometry, geometryKey: "geometry.pig" }
})