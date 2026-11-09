"use client";
import { Button } from "@/components/ui/button";
export default function CatalogError({ reset }: { reset: () => void }) {
  return (
    <main id="main" tabIndex={-1} className="container py-20">
      <h1 className="!text-4xl">Le catalogue est indisponible.</h1>
      <p className="muted my-6">
        Impossible de charger les références. Veuillez réessayer.
      </p>
      <Button onClick={reset}>Réessayer</Button>
    </main>
  );
}
