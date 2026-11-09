"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
export function LogoutButton() {
  const router = useRouter();
  const [error, setError] = useState(false);
  async function logout() {
    try {
      const response = await fetch("/api/auth/sign-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      if (!response.ok) {
        setError(true);
        return;
      }
      router.push("/connexion");
      router.refresh();
    } catch {
      setError(true);
    }
  }
  return (
    <div>
      <Button variant="outline" size="sm" onClick={logout}>
        Se déconnecter
      </Button>
      {error && (
        <p role="alert" className="mt-2 text-xs">
          Déconnexion impossible. Réessayez.
        </p>
      )}
    </div>
  );
}
