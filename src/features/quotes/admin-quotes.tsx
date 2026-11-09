import Link from "next/link";
import { listQuotes, getQuoteDetail } from "@/server/quote-service";
import { quoteSearchSchema, quoteStatuses, statusLabels } from "./validation";
import { StatusForm } from "./status-form";
import { notFound } from "next/navigation";

const date = (value: Date) =>
  new Intl.DateTimeFormat("fr-MA", {
    timeZone: "Africa/Casablanca",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
export async function AdminQuotes({
  query,
}: {
  query: Record<string, string | string[] | undefined>;
}) {
  const parsed = quoteSearchSchema.safeParse({
    q: query.q,
    status: query.status || undefined,
    page: query.page,
  });
  const input = parsed.success ? parsed.data : quoteSearchSchema.parse({});
  const { quotes, total, page } = await listQuotes(input);
  const pageUrl = (number: number) =>
    `/admin/devis?${new URLSearchParams({ q: input.q, ...(input.status ? { status: input.status } : {}), page: String(number) })}`;
  return (
    <>
      <h1 className="!text-3xl">Demandes de devis</h1>
      <form className="panel my-6 flex flex-wrap items-end gap-4">
        <label>
          Rechercher
          <input
            className="form-field"
            name="q"
            defaultValue={input.q}
            maxLength={120}
            placeholder="Référence, société, nom, ville"
          />
        </label>
        <label>
          Statut
          <select
            className="form-field"
            name="status"
            defaultValue={input.status ?? ""}
          >
            <option value="">Tous</option>
            {quoteStatuses.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </label>
        <button className="text-link min-h-11" type="submit">
          Filtrer
        </button>
      </form>
      <p role="status">
        {total} demande(s) · Page {page} sur{" "}
        {Math.max(1, Math.ceil(total / 20))}
      </p>
      <div className="my-6 space-y-4">
        {quotes.map((quote) => (
          <article className="panel" key={quote.id}>
            <Link
              className="text-link break-all"
              href={`/admin/devis/${quote.id}`}
            >
              {quote.reference}
            </Link>
            <p className="my-3">
              {quote.companyName ?? "Société non renseignée"} ·{" "}
              {quote.city ?? "Ville non renseignée"}
            </p>
            <p>
              {statusLabels[quote.status]} · {date(quote.createdAt)}
            </p>
            {quote.isDemo && <span className="demo-badge">Démonstration</span>}
          </article>
        ))}
        {!quotes.length && <p>Aucune demande trouvée.</p>}
      </div>
      <nav aria-label="Pagination des devis" className="flex gap-6">
        {page > 1 && (
          <Link className="text-link" href={pageUrl(page - 1)}>
            Précédent
          </Link>
        )}
        {page * 20 < total && (
          <Link className="text-link" href={pageUrl(page + 1)}>
            Suivant
          </Link>
        )}
      </nav>
    </>
  );
}

export async function AdminQuoteDetail({ id }: { id: string }) {
  const { quote, history } = await getQuoteDetail(id);
  if (!quote) notFound();
  return (
    <>
      <Link className="text-link mb-6" href="/admin/devis">
        Retour aux demandes
      </Link>
      <h1 className="!text-2xl break-all">{quote.reference}</h1>
      {quote.isDemo && (
        <p className="demo-badge my-4">
          Demande contenant des produits de démonstration
        </p>
      )}
      <StatusForm key={quote.status} id={quote.id} status={quote.status} />
      <section className="panel my-6">
        <h2 className="!text-xl">Coordonnées et chantier</h2>
        <dl className="my-5 grid gap-4 sm:grid-cols-2">
          {Object.entries({
            "Nom et prénom": quote.contactName,
            Société: quote.companyName ?? quote.customer?.companyName,
            Email: quote.email ?? quote.customer?.email,
            Téléphone: quote.phone ?? quote.customer?.phone,
            Ville: quote.city ?? quote.customer?.city,
            Adresse: quote.siteAddress,
            Demande:
              quote.requestType === "RENTAL"
                ? "Location"
                : quote.requestType === "SALE"
                  ? "Vente"
                  : null,
            Création: date(quote.createdAt),
          }).map(([label, value]) => (
            <div key={label}>
              <dt className="muted text-sm">{label}</dt>
              <dd>{value || "Non renseigné"}</dd>
            </div>
          ))}
        </dl>
        {quote.rentalStart && quote.rentalEnd && (
          <p>
            Location du {quote.rentalStart.toISOString().slice(0, 10)} au{" "}
            {quote.rentalEnd.toISOString().slice(0, 10)}
          </p>
        )}
        <p className="mt-5 whitespace-pre-wrap">
          {quote.notes || "Aucun message complémentaire."}
        </p>
      </section>
      <section className="panel my-6">
        <h2 className="!text-xl">Produits demandés</h2>
        <ul className="my-5 space-y-4">
          {quote.lines.map((line) => (
            <li key={line.id}>
              <strong>{line.label}</strong> · {line.sku} · Quantité :{" "}
              {line.quantity.toString()}
              <p className="muted text-sm">
                Prix unitaire enregistré côté serveur :{" "}
                {line.unitPrice === null
                  ? "Non renseigné"
                  : `${line.unitPrice.toFixed(2)} MAD`}{" "}
                · TVA :{" "}
                {line.taxRate === null
                  ? "Non renseignée"
                  : `${line.taxRate.toString()} %`}
              </p>
            </li>
          ))}
        </ul>
      </section>
      <section className="panel">
        <h2 className="!text-xl">Historique</h2>
        <ol className="my-5 space-y-3">
          {history.map((entry) => (
            <li key={entry.id}>
              {date(entry.createdAt)} ·{" "}
              {entry.action === "QUOTE_SUBMITTED"
                ? "Demande reçue"
                : "Changement de statut"}
              {entry.metadata &&
                typeof entry.metadata === "object" &&
                !Array.isArray(entry.metadata) &&
                typeof entry.metadata.to === "string" && (
                  <span> · {entry.metadata.to}</span>
                )}
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
