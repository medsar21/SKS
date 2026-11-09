import { listMedia } from "@/server/media-service";
import { MediaManager } from "@/features/cms/media-manager";
export default async function MediaPage() {
  const media = await listMedia();
  return (
    <MediaManager
      assets={media.map(({ id, name, alt, mimeType, size }) => ({
        id,
        name,
        alt,
        mimeType,
        size,
      }))}
    />
  );
}
