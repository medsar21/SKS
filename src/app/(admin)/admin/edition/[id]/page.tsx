import { notFound } from "next/navigation";
import { getEntryEditor } from "@/server/cms-service";
import { listMedia } from "@/server/media-service";
import { EntryEditor } from "@/features/cms/entry-editor";
import { articleDrafts } from "@/features/cms/article-drafts";
export default async function EditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string; proposition?: string }>;
}) {
  const [{ id }, { type, proposition }] = await Promise.all([
    params,
    searchParams,
  ]);
  const [entry, media] = await Promise.all([
    getEntryEditor(id, type === "ARTICLE" ? "ARTICLE" : "PAGE"),
    listMedia(),
  ]);
  if (!entry) notFound();
  const draft =
    id === "nouveau" && entry.kind === "ARTICLE" && proposition
      ? articleDrafts.find((article) => article.slug === proposition)
      : undefined;
  if (id === "nouveau" && proposition && !draft) notFound();
  return (
    <EntryEditor
      key={entry.id ?? `${id}-${draft?.slug ?? ""}`}
      entry={
        draft
          ? {
              ...entry,
              key: draft.slug,
              title: draft.title,
              summary: draft.summary,
              body: draft.body,
            }
          : entry
      }
      media={media.map(({ id, alt, name, mimeType }) => ({
        id,
        alt,
        name,
        mimeType,
      }))}
    />
  );
}
