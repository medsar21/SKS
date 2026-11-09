"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="container py-24">
      <h1 className="!text-4xl">Le service est indisponible.</h1>
      <p className="muted">
        Une erreur empêche le chargement. Réessayez dans quelques instants.
      </p>
      <button onClick={reset} className="mt-6 border px-5 py-3">
        Réessayer
      </button>
    </main>
  );
}
