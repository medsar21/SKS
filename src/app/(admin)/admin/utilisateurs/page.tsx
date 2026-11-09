import Link from "next/link";
import { UsersRound, ShieldCheck } from "lucide-react";
import { CreateUserForm } from "@/features/users/create-user-form";
import { userPageSchema, userRoleLabels } from "@/features/users/validation";
import { listManagedUsers } from "@/server/user-service";

export const metadata = { title: "Utilisateurs" };

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const query = await searchParams;
  const parsedPage = userPageSchema.safeParse(query.page ?? 1);
  const { users, total, page, pages } = await listManagedUsers(
    parsedPage.success ? parsedPage.data : 1,
  );

  return (
    <>
      <div className="cms-page-heading">
        <div>
          <p className="eyebrow">
            <UsersRound size={17} aria-hidden="true" /> ADMINISTRATION
          </p>
          <h1>Utilisateurs</h1>
          <p className="muted">
            Créez les accès et choisissez les droits de chaque utilisateur.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck size={18} aria-hidden="true" /> Réservé aux
          administrateurs
        </span>
      </div>
      {process.env.NODE_ENV !== "production" && (
        <p className="cms-notice">
          Environnement local : les comptes créés ici sont réservés au
          développement et ne permettent pas de se connecter en production.
        </p>
      )}
      <section className="cms-panel" aria-labelledby="create-user-title">
        <h2 id="create-user-title" className="mb-6">
          Ajouter un utilisateur
        </h2>
        <CreateUserForm />
      </section>
      <section className="cms-panel" aria-labelledby="user-directory-title">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 id="user-directory-title">Comptes existants</h2>
          <span className="muted">{total} utilisateur(s)</span>
        </div>
        <ul className="divide-y divide-border">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex flex-wrap items-start justify-between gap-4 py-5"
            >
              <div className="min-w-0 flex-1 basis-48 break-words">
                <p className="font-semibold">{user.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {user.email}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Créé le{" "}
                  {user.createdAt.toLocaleDateString("fr-MA", {
                    timeZone: "Africa/Casablanca",
                  })}
                  {user.developmentOnly ? " · Développement" : ""}
                </p>
              </div>
              <span className="rounded-full bg-muted px-3 py-2 text-xs font-semibold">
                {userRoleLabels[user.role]}
              </span>
            </li>
          ))}
        </ul>
        {users.length === 0 && (
          <p className="muted">Aucun utilisateur à afficher.</p>
        )}
        {pages > 1 && (
          <nav
            aria-label="Pagination des utilisateurs"
            className="mt-6 flex flex-wrap items-center gap-4"
          >
            {page > 1 && (
              <Link
                className="cms-secondary"
                href={`/admin/utilisateurs?page=${page - 1}`}
              >
                Précédent
              </Link>
            )}
            <span className="text-sm">
              Page {page} sur {pages}
            </span>
            {page < pages && (
              <Link
                className="cms-secondary"
                href={`/admin/utilisateurs?page=${page + 1}`}
              >
                Suivant
              </Link>
            )}
          </nav>
        )}
      </section>
    </>
  );
}
