"use client";
import { useSiteContent } from "@/features/cms/site-content";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { TurnstileWidget } from "./turnstile-widget";
const schema = z.object({
  email: z.email("Adresse email invalide"),
  password: z.string().min(1, "Mot de passe requis").max(128),
});
type Values = z.infer<typeof schema>;
export function LoginForm({ configured }: { configured: boolean }) {
  const { t } = useSiteContent("autres");

  const router = useRouter();
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [challengeVersion, setChallengeVersion] = useState(0);
  const challengeEnabled = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });
  async function submit(values: Values) {
    setError("");
    if (challengeEnabled && !token) {
      setError("Veuillez terminer la vérification anti-robot.");
      return;
    }
    try {
      const response = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-turnstile-token": token,
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        const errorBody: unknown = await response.json().catch(() => null);
        const invalidOrigin =
          response.status === 403 &&
          errorBody !== null &&
          typeof errorBody === "object" &&
          "code" in errorBody &&
          errorBody.code === "INVALID_ORIGIN";
        const challengeFailed =
          errorBody !== null &&
          typeof errorBody === "object" &&
          "code" in errorBody &&
          errorBody.code === "TURNSTILE_FAILED";
        setError(
          challengeFailed
            ? "Vérification anti-robot expirée ou refusée. Réessayez."
            : invalidOrigin
              ? "Ce domaine n’est pas autorisé pour la connexion. Contactez l’administrateur."
              : response.status === 429
                ? "Trop de tentatives. Réessayez dans une minute."
                : "Connexion impossible. Vérifiez vos identifiants ou contactez votre administrateur.",
        );
        return;
      }
      router.push("/espace-client");
      router.refresh();
    } catch {
      setError("Le service est momentanément inaccessible.");
    } finally {
      setToken("");
      setChallengeVersion((version) => version + 1);
    }
  }
  return (
    <form method="post" onSubmit={handleSubmit(submit)} noValidate>
      <fieldset disabled={!configured || isSubmitting}>
        <label className="form-label" htmlFor="email">
          {t("Email professionnel")}
          <input
            {...register("email")}
            id="email"
            type="email"
            autoComplete="username"
            className="form-field"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <span id="email-error" className="mt-2 block text-xs text-red-700">
              {errors.email.message}
            </span>
          )}
        </label>
        <label className="form-label" htmlFor="password">
          {t("Mot de passe")}
          <input
            {...register("password")}
            id="password"
            type="password"
            autoComplete="current-password"
            className="form-field"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <span
              id="password-error"
              className="mt-2 block text-xs text-red-700"
            >
              {errors.password.message}
            </span>
          )}
        </label>
        {configured && challengeEnabled && (
          <TurnstileWidget key={challengeVersion} onToken={setToken} />
        )}
        <Button
          className="w-full"
          type="submit"
          disabled={challengeEnabled && !token}
        >
          {isSubmitting ? "Connexion…" : "Se connecter"}
        </Button>
      </fieldset>
      {error && (
        <p role="alert" className="mt-4 text-sm text-red-700">
          {error}
        </p>
      )}
    </form>
  );
}
