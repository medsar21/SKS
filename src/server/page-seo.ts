import "server-only";
import { getSiteContent } from "./cms-service";
export async function pageSeo(
  page: "about" | "projects" | "catalog" | "contact",
) {
  const { settings } = await getSiteContent();
  return settings.pageSeo[page];
}
