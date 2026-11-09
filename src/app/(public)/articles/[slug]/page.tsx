import { notFound } from "next/navigation";
import { getPublicEntry } from "@/server/cms-service";
import { EntryPreview } from "@/features/cms/entry-preview";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const page = await getPublicEntry("ARTICLE", (await params).slug);
  return {
    title: page?.body.seoTitle || page?.title || "Article introuvable",
    description: page?.body.seoDescription || page?.summary,
  };
}
export default async function PublicArticlePage({ params }: Props) {
  const entry = await getPublicEntry("ARTICLE", (await params).slug);
  if (!entry) notFound();
  return (
    <main id="main" tabIndex={-1} className="container py-16">
      <EntryPreview {...entry} />
    </main>
  );
}
