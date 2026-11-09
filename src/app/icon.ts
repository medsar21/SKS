import { getBrandIcon } from "@/server/brand-icon";

export const dynamic = "force-dynamic";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  return new Response(new Uint8Array(await getBrandIcon()), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=300",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
