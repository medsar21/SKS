"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/features/cms/site-content";

export function SiteNavigation() {
  const { settings } = useSiteContent();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        toggle.current?.focus();
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  return (
    <nav aria-label="Navigation principale" className="site-navigation">
      <Button
        ref={toggle}
        variant="ghost"
        size="icon"
        className="navigation-toggle"
        aria-expanded={open}
        aria-controls="primary-navigation"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <X aria-hidden="true" size={22} />
        ) : (
          <Menu aria-hidden="true" size={22} />
        )}
      </Button>
      <div
        id="primary-navigation"
        className="navigation-panel"
        data-open={open}
      >
        <ul className="navigation-links">
          {settings.navigation.map(({ href, label }, index) => (
            <li key={`${href}-${index}`}>
              <Link
                className="nav-link"
                data-account={href === "/espace-client"}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {href === "/espace-client" && (
                  <UserRound size={14} aria-hidden="true" />
                )}
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <Button asChild size="sm" variant="accent">
          <Link href={settings.cta.href} onClick={() => setOpen(false)}>
            {settings.cta.label} <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </Button>
      </div>
    </nav>
  );
}
