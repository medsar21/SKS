"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { initializeSite } from "@/server/site-initialization-actions";
export function SiteInitialization() {
  const [confirmed, setConfirmed] = useState(false);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const router = useRouter();
  return (
    <section className="cms-panel">
      <p className="eyebrow">MISE EN SERVICE</p>
      <h2>Importer la présentation SKS PROJETS</h2>
      <p className="muted my-4">
        Ajoute les 17 produits, les six catégories, les photos et les contenus
        du PDF manquants. Les contenus existants et leurs modifications sont
        conservés. Aucun compte n’est créé.
      </p>
      <label className="cms-check">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(event) => setConfirmed(event.target.checked)}
        />
        Je confirme l’import du contenu fourni.
      </label>
      <button
        className="cms-primary mt-4"
        disabled={!confirmed || pending}
        onClick={() =>
          startTransition(async () => {
            const result = await initializeSite();
            setMessage(
              result.error ??
                `Import terminé : ${result.productsCreated} produit(s), ${result.categoriesCreated} catégorie(s), ${result.mediaCreated} média(s), ${result.contentsCreated} contenu(s) ajouté(s).`,
            );
            router.refresh();
          })
        }
      >
        {pending ? "Import en cours…" : "Initialiser les contenus du site"}
      </button>
      <p role="status" className="mt-4 text-sm">
        {message}
      </p>
    </section>
  );
}
