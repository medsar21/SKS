"use client";
import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { uploadMedia, updateMedia, deleteMedia } from "@/server/media-actions";
import { MAX_MEDIA_BYTES, MAX_MEDIA_LABEL } from "./media-limits";
type Asset = {
  id: string;
  name: string;
  alt: string;
  mimeType: string;
  size: number;
};
function MediaItem({ asset }: { asset: Asset }) {
  const router = useRouter();
  const [alt, setAlt] = useState(asset.alt),
    [pending, startTransition] = useTransition(),
    [message, setMessage] = useState(""),
    [confirm, setConfirm] = useState(false);
  return (
    <article className="cms-media-card">
      {asset.mimeType.startsWith("image/") ? (
        <Image
          src={`/media/${asset.id}`}
          alt={asset.alt}
          width={500}
          height={300}
          className="cms-media-image"
        />
      ) : (
        <a href={`/media/${asset.id}`} className="cms-pdf">
          PDF ↓
        </a>
      )}
      <div className="cms-media-copy">
        <strong>{asset.name}</strong>
        <small>
          {Math.ceil(asset.size / 1024)} Ko · {asset.mimeType}
        </small>
        <label className="cms-field">
          Texte alternatif / description
          <input
            value={alt}
            maxLength={500}
            onChange={(e) => setAlt(e.target.value)}
          />
        </label>
        <code>/media/{asset.id}</code>
        <div className="cms-actions">
          <button
            className="cms-secondary"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const result = await updateMedia(asset.id, alt);
                setMessage(result.error ?? "Description enregistrée.");
                router.refresh();
              })
            }
          >
            Enregistrer
          </button>
          <button
            className="cms-secondary"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(`/media/${asset.id}`);
                setMessage("Lien copié.");
              } catch {
                setMessage("Sélectionnez et copiez le lien affiché.");
              }
            }}
          >
            Copier le lien
          </button>
          <button
            className="cms-danger"
            disabled={pending}
            onClick={() => setConfirm(!confirm)}
          >
            Supprimer
          </button>
        </div>
        {confirm && (
          <p>
            Supprimer ce média ?{" "}
            <button
              className="cms-danger"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  const result = await deleteMedia(asset.id);
                  if (result.error) setMessage(result.error);
                  else router.refresh();
                })
              }
            >
              Confirmer
            </button>{" "}
            <button onClick={() => setConfirm(false)}>Annuler</button>
          </p>
        )}
        <p role="status">{message}</p>
      </div>
    </article>
  );
}
export function MediaManager({ assets }: { assets: Asset[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition(),
    [message, setMessage] = useState("");
  return (
    <>
      <div className="cms-page-heading">
        <div>
          <p className="eyebrow">IMAGES & DOCUMENTS</p>
          <h1>Médiathèque</h1>
          <p className="muted">
            Images JPEG, PNG, WebP, AVIF, GIF et documents PDF ·{" "}
            {MAX_MEDIA_LABEL} maximum par fichier.
          </p>
        </div>
      </div>
      <form
        className="cms-panel cms-fields"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const data = new FormData(form);
          const file = data.get("file");
          if (file instanceof File && file.size > MAX_MEDIA_BYTES) {
            setMessage(`Choisissez un fichier de ${MAX_MEDIA_LABEL} maximum.`);
            return;
          }
          setMessage("");
          startTransition(async () => {
            try {
              const result = await uploadMedia(data);
              setMessage(result.error ?? "Média ajouté à la bibliothèque.");
              if (result.success) {
                form.reset();
                router.refresh();
              }
            } catch {
              setMessage("Téléversement interrompu. Réessayez.");
            }
          });
        }}
      >
        <p className="cms-notice">
          Les fichiers ajoutés sont accessibles publiquement par leur lien.
          Utilisez uniquement des visuels et documents destinés au site.
        </p>
        <label className="cms-field">
          Fichier
          <input
            type="file"
            name="file"
            required
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif,application/pdf"
          />
        </label>
        <label className="cms-field">
          Description du média
          <input name="alt" required maxLength={500} />
        </label>
        <button className="cms-primary" disabled={pending}>
          {pending ? "Téléversement…" : "Ajouter le média"}
        </button>
        <p role="status">{message}</p>
      </form>
      <div className="cms-media-grid">
        {assets.map((asset) => (
          <MediaItem key={asset.id} asset={asset} />
        ))}
      </div>
      {!assets.length && (
        <p className="cms-empty">
          La bibliothèque est vide. Ajoutez votre première image ou votre
          premier document.
        </p>
      )}
    </>
  );
}
