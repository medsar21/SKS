import "server-only";
import { getSiteContent } from "./cms-service";
export async function pageSeo(
  page: "about" | "projects" | "catalog" | "contact" | "services",
) {
  const { settings } = await getSiteContent();
  return settings.pageSeo[page];
}
