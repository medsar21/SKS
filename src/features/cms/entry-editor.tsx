"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  saveContent,
  restoreContent,
  deleteContent,
} from "@/server/cms-actions";
import { copyGroups } from "./copy-defaults";
import {
  FieldTree,
  ImageField,
  type JsonValue,
  type MediaChoice,
} from "./field-tree";
import { EntryPreview } from "./entry-preview";
import { pageBodySchema } from "./validation";

export type EditorEntry = {
  id?: string;
  key: string;
  kind: "PAGE" | "ARTICLE" | "COPY" | "SETTINGS";
  title: string;
  summary: string;
  body: unknown;
  published: boolean;
  revision: number;
  revisions: {
    id: string;
    version: number;
    createdAt: string;
    createdAtLabel: string;
  }[];
};
export function EntryEditor({
  entry,
  media,
}: {
  entry: EditorEntry;
  media: MediaChoice[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [id, setId] = useState(entry.id),
    [revision, setRevision] = useState(entry.revision),
    [title, setTitle] = useState(entry.title),
    [key, setKey] = useState(entry.key),
    [summary, setSummary] = useState(entry.summary),
    [body, setBody] = useState(entry.body as JsonValue),
    [published, setPublished] = useState(entry.published);
  const [message, setMessage] = useState(""),
    [error, setError] = useState(""),
    [filter, setFilter] = useState(""),
    [preview, setPreview] = useState(false),
    [dirty, setDirty] = useState(false),
    [deleting, setDeleting] = useState(false);
  const editablePage = entry.kind === "PAGE" || entry.kind === "ARTICLE";
  useEffect(() => {
    if (!dirty) return;
    function warn(event: BeforeUnloadEvent) {
      event.preventDefault();
    }
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function save(intent: "draft" | "publish" | "unpublish") {
    setMessage("");
    setError("");
    startTransition(async () => {
      try {
        const result = await saveContent({
          id,
          revision,
          kind: entry.kind,
          key,
          title,
          summary,
          body,
          intent,
        });
        if (result.error) {
          setError(result.error);
          return;
        }
        if (result.id) {
          setId(result.id);
          setRevision(result.revision!);
          if (intent !== "draft") setPublished(intent === "publish");
          setDirty(false);
          setMessage(
            intent === "publish"
              ? "Modifications publiées sur le site."
              : intent === "unpublish"
                ? "Publication retirée. Le brouillon est conservé."
                : "Brouillon enregistré. La version publique reste inchangée.",
          );
          router.replace(
            entry.kind === "SETTINGS" && key === "references"
              ? "/admin/references"
              : `/admin/edition/${result.id}`,
            { scroll: false },
          );
          router.refresh();
        }
      } catch {
        setError(
          "Connexion interrompue. Vérifiez l’enregistrement avant de réessayer.",
        );
      }
    });
  }
  const parsedPreview = editablePage ? pageBodySchema.safeParse(body) : null;
  return (
    <div className="cms-editor">
      <div className="cms-page-heading">
        <div>
          <p className="eyebrow">
            {entry.kind === "SETTINGS"
              ? key === "references"
                ? "LOGOS & RÉFÉRENCES"
                : "IDENTITÉ & CONFIGURATION"
              : entry.kind === "COPY"
                ? "CONTENUS DU SITE"
                : entry.kind === "ARTICLE"
                  ? "ARTICLE"
                  : "PAGE"}
          </p>
          <h1>
            {entry.kind === "COPY"
              ? `Textes · ${key}`
              : entry.kind === "SETTINGS"
                ? key === "references"
                  ? "Nos références"
                  : "Paramètres du site"
                : id
                  ? "Modifier le contenu"
                  : "Créer un contenu"}
          </h1>
          <p className="muted">
            {published ? "Une version est publiée" : "Aucune version publiée"} ·
            Version {revision} {dirty ? "· Modifications non enregistrées" : ""}
          </p>
        </div>
        <Link className="cms-secondary" href="/admin">
          ← Tableau de bord
        </Link>
      </div>
      <div className="cms-notice">
        Enregistrez un brouillon pour travailler, puis utilisez « Publier les
        modifications » pour les afficher sur le site. Les images et documents
        téléversés sont accessibles par leur lien public.
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save("draft");
        }}
        onChange={() => setDirty(true)}
      >
        <fieldset disabled={pending} className="cms-editor-fieldset">
          {editablePage && (
            <div className="cms-panel cms-fields">
              <label className="cms-field">
                Titre
                <input
                  required
                  maxLength={200}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
              <label className="cms-field">
                Lien de la {entry.kind === "ARTICLE" ? "publication" : "page"}
                <div className="cms-slug">
                  <span>/{entry.kind === "ARTICLE" ? "articles/" : ""}</span>
                  <input
                    required
                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                    maxLength={100}
                    readOnly={published}
                    aria-describedby={
                      published ? "cms-published-link" : undefined
                    }
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                  />
                </div>
                {published && (
                  <small id="cms-published-link">
                    Retirez la publication avant de modifier ce lien.
                  </small>
                )}
              </label>
              <label className="cms-field">
                Résumé
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </label>
            </div>
          )}
          <div className="cms-panel">
            {entry.kind === "COPY" ? (
              <>
                <label className="cms-field">
                  Rechercher un texte
                  <input
                    type="search"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Titre, bouton, image…"
                  />
                </label>
                <p className="muted mb-6">
                  Les champs ci-dessous modifient les textes, images et liens du
                  design existant. Une même expression est partagée dans ce
                  groupe.
                </p>
                {(copyGroups[entry.key] ?? [])
                  .filter((item) => item.kind !== "image")
                  .filter((item) =>
                    item.value
                      .toLocaleLowerCase("fr")
                      .includes(filter.toLocaleLowerCase("fr")),
                  )
                  .map((item, index) => {
                    const values = body as Record<string, string>;
                    return (
                      <div className="cms-copy-field" key={item.value}>
                        <span className="cms-field-number">{index + 1}</span>
                        {item.kind === "image" ? (
                          <ImageField
                            label={item.value}
                            value={values[item.value] ?? item.value}
                            media={media}
                            onChange={(v) => {
                              setDirty(true);
                              setBody({ ...values, [item.value]: v });
                            }}
                          />
                        ) : (
                          <label className="cms-field">
                            <span>{item.value}</span>
                            <textarea
                              rows={item.value.length > 120 ? 3 : 1}
                              value={values[item.value] ?? item.value}
                              maxLength={20000}
                              onChange={(e) =>
                                setBody({
                                  ...values,
                                  [item.value]: e.target.value,
                                })
                              }
                            />
                            {item.kind === "url" && (
                              <small>
                                Chemin du site, ancre ou lien https://.
                              </small>
                            )}
                          </label>
                        )}
                      </div>
                    );
                  })}
              </>
            ) : (
              <FieldTree
                value={body}
                media={media}
                onChange={(v) => {
                  setBody(v);
                  setDirty(true);
                }}
              />
            )}
          </div>
          <div className="cms-savebar">
            <span>
              {pending
                ? "Enregistrement…"
                : dirty
                  ? "Modifications à enregistrer"
                  : "Version enregistrée"}
            </span>
            <div className="cms-actions">
              <button type="submit" className="cms-secondary">
                Enregistrer le brouillon
              </button>
              {editablePage && (
                <button
                  className="cms-secondary"
                  type="button"
                  onClick={() => setPreview(!preview)}
                >
                  {preview ? "Fermer l’aperçu" : "Aperçu"}
                </button>
              )}
              <button
                type="button"
                className="cms-primary"
                onClick={() => save("publish")}
              >
                Publier les modifications
              </button>
              {published && (
                <button
                  type="button"
                  className="cms-secondary"
                  onClick={() => save("unpublish")}
                >
                  Retirer la publication
                </button>
              )}
            </div>
          </div>
        </fieldset>
      </form>
      <div aria-live="polite">
        {error && (
          <p role="alert" className="cms-error">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="cms-success">
            {message}
          </p>
        )}
      </div>
      {editablePage &&
        preview &&
        (parsedPreview?.success ? (
          <div className="cms-preview">
            <p className="cms-notice">
              Aperçu du contenu en cours · les changements ne sont pas publiés.
            </p>
            <EntryPreview
              title={title}
              summary={summary}
              body={parsedPreview.data}
            />
          </div>
        ) : (
          <p className="cms-error">
            Complétez les liens et les descriptions des images pour afficher
            l’aperçu.
          </p>
        ))}
      {editablePage && published && (
        <a
          className="text-link"
          target="_blank"
          rel="noreferrer"
          href={`/${entry.kind === "ARTICLE" ? "articles/" : ""}${entry.key}`}
        >
          Ouvrir la version publique ↗
        </a>
      )}
      {id && (
        <details className="cms-panel mt-6">
          <summary>
            Historique des versions ({entry.revisions.length} dernières)
          </summary>
          <p className="muted my-4">
            Restaurer crée un nouveau brouillon. La publication actuelle est
            conservée.
          </p>
          <ul className="cms-history">
            {entry.revisions.map((r) => (
              <li key={r.id}>
                <span>
                  Version {r.version} ·{" "}
                  <time dateTime={r.createdAt}>{r.createdAtLabel}</time>
                </span>
                <button
                  disabled={pending || dirty}
                  type="button"
                  className="cms-secondary"
                  onClick={() =>
                    startTransition(async () => {
                      const result = await restoreContent(id, r.version);
                      if (result.error) setError(result.error);
                      else {
                        window.location.assign(`/admin/edition/${id}`);
                      }
                    })
                  }
                >
                  Restaurer
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
      {editablePage && id && !published && (
        <div className="cms-panel mt-6">
          <button
            type="button"
            className="cms-danger"
            disabled={pending}
            onClick={() => setDeleting(!deleting)}
          >
            Supprimer ce brouillon
          </button>
          {deleting && (
            <div className="cms-notice">
              La suppression retire ce contenu et son historique.{" "}
              <button
                type="button"
                className="cms-danger"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    const result = await deleteContent(id, revision);
                    if (result.error) setError(result.error);
                    else
                      router.push(
                        entry.kind === "ARTICLE"
                          ? "/admin/articles"
                          : "/admin/pages",
                      );
                  })
                }
              >
                Confirmer la suppression
              </button>{" "}
              <button type="button" onClick={() => setDeleting(false)}>
                Annuler
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
