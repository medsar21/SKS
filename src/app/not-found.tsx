import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="container py-24">
      <p className="eyebrow text-primary">404</p>
      <h1 className="!text-4xl">Cette page n’existe pas.</h1>
      <Link className="text-link" href="/">
        Retour à l’accueil →
      </Link>
    </main>
  );
}
