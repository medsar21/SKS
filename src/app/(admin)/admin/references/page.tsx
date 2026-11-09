import { getEntryEditor } from "@/server/cms-service";
import { listMedia } from "@/server/media-service";
import { EntryEditor } from "@/features/cms/entry-editor";
import Link from "next/link";

export default async function ReferencesAdminPage() {
  const [entry, media] = await Promise.all([
    getEntryEditor("references"),
    listMedia(),
  ]);
  if (!entry) return null;
  return (
    <>
      <p className="cms-notice mb-6">
        Ajoutez vos logos dans la{" "}
        <Link href="/admin/medias" className="text-link">
          médiathèque
        </Link>
        , puis sélectionnez-les ci-dessous. Vous pouvez les réordonner ou les
        retirer. Publiez pour actualiser le bandeau animé de l’accueil.
      </p>
      <EntryEditor entry={entry} media={media} />
    </>
  );
}
