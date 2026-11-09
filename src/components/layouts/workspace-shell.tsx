import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  LayoutDashboard,
  LockKeyhole,
  UserRound,
} from "lucide-react";
import { Brand } from "@/components/site-header";
import { LogoutButton } from "@/features/auth/logout-button";
import { AdminNavigation } from "@/features/cms/admin-navigation";

const workspaces = {
  admin: {
    label: "Administration",
    href: "/admin",
    entry: "Vue d’ensemble",
    icon: LayoutDashboard,
  },
  customer: {
    label: "Espace client",
    href: "/espace-client",
    entry: "Mon espace",
    icon: UserRound,
  },
} as const;

// Présentation uniquement : chaque layout de route contrôle l'accès côté serveur.
export function WorkspaceShell({
  area,
  children,
  contentAdmin = false,
}: {
  area: keyof typeof workspaces;
  children: ReactNode;
  contentAdmin?: boolean;
}) {
  const workspace = workspaces[area];
  const Icon = workspace.icon;
  return (
    <div className="workspace-shell">
      <aside className="workspace-sidebar">
        <Brand />
        <p className="workspace-label">{workspace.label}</p>
        {area === "admin" ? (
          <AdminNavigation contentAdmin={contentAdmin} />
        ) : (
          <nav aria-label={`Navigation ${workspace.label.toLowerCase()}`}>
            <Link
              href={workspace.href}
              className="workspace-link"
              aria-current="page"
            >
              <Icon aria-hidden="true" size={18} /> {workspace.entry}
            </Link>
          </nav>
        )}
        <p className="mt-8 flex items-center gap-2 text-xs text-white/75">
          <LockKeyhole aria-hidden="true" size={16} /> Espace réservé
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm text-white/80"
        >
          <ArrowLeft aria-hidden="true" size={16} className="rtl:rotate-180" />{" "}
          Voir le site public
        </Link>
      </aside>
      <div className="min-w-0">
        <header className="workspace-header">
          <span className="text-sm font-semibold">
            SKS PROJETS · {workspace.label}
          </span>
          <LogoutButton />
        </header>
        <main id="main" tabIndex={-1} className="workspace-content">
          {children}
        </main>
        <footer className="workspace-footer">
          Administration SKS PROJETS · MNH Technologie
        </footer>
      </div>
    </div>
  );
}
