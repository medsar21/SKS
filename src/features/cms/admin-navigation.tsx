"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  Package,
  FolderTree,
  ImageIcon,
  Settings,
  Type,
  ClipboardList,
  History,
  UsersRound,
} from "lucide-react";
const links = [
  { href: "/admin", label: "Vue d’ensemble", icon: LayoutDashboard },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: UsersRound },
  { href: "/admin/textes", label: "Textes du site", icon: Type },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/articles", label: "Articles", icon: Newspaper },
  { href: "/admin/produits", label: "Produits", icon: Package },
  { href: "/admin/categories", label: "Catégories", icon: FolderTree },
  { href: "/admin/medias", label: "Médiathèque", icon: ImageIcon },
  { href: "/admin/references", label: "Nos références", icon: ImageIcon },
  { href: "/admin/devis", label: "Demandes de devis", icon: ClipboardList },
  { href: "/admin/edition/site", label: "Paramètres du site", icon: Settings },
  { href: "/admin/historique", label: "Journal d’activité", icon: History },
];
export function AdminNavigation({ contentAdmin }: { contentAdmin: boolean }) {
  const path = usePathname();
  return (
    <nav aria-label="Navigation administration">
      {links
        .filter(
          (link) =>
            contentAdmin || ["/admin", "/admin/devis"].includes(link.href),
        )
        .map(({ href, label, icon: Icon }) => (
          <Link
            href={href}
            key={href}
            className="workspace-link"
            aria-current={
              (href === "/admin" ? path === href : path.startsWith(href))
                ? "page"
                : undefined
            }
          >
            <Icon size={17} aria-hidden="true" />
            {label}
          </Link>
        ))}
    </nav>
  );
}
