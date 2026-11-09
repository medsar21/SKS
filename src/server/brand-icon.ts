import "server-only";
import { readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
import sharp from "sharp";
import { getSiteContent } from "./cms-service";
import { getPublicMedia } from "./media-service";
import { imagePath } from "@/features/cms/validation";

export async function getBrandIcon() {
  const { settings } = await getSiteContent();
  const source = imagePath.parse(
    settings.logo || "/images/sks-projets-logo.png",
  );
  let image: Buffer | Uint8Array | undefined;
  if (source.startsWith("/media/")) {
    const media = await getPublicMedia(source.slice(7));
    if (media?.mimeType.startsWith("image/")) image = media.data;
  } else {
    const root = resolve("public");
    const path = resolve(root, `.${source}`);
    if (path.startsWith(root + sep)) image = await readFile(path);
  }
  image ??= await readFile(resolve("public/images/sks-projets-logo.png"));
  return sharp(image, { limitInputPixels: 40_000_000 })
    .trim()
    .resize(64, 64, { fit: "contain", background: "#ffffff00" })
    .png()
    .toBuffer();
}
