"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addUser } from "@/server/user-actions";
import {
  createUserSchema,
  userRoles,
  userRoleLabels,
  type CreateUserInput,
} from "./validation";

export function CreateUserForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<{
    error?: string;
    success?: string;
  }>({});
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "CUSTOMER",
      password: "",
      confirmPassword: "",
    },
  });

  async function submit(values: CreateUserInput) {
    setFeedback({});
    try {
      const result = await addUser(values);
      if ("error" in result) {
        setFeedback({ error: result.error });
        return;
      }
      reset();
      setShowPassword(false);
      setFeedback({
        success:
          "Utilisateur créé. Il peut se connecter avec l’email et le mot de passe définis.",
      });
      router.refresh();
    } catch {
      setFeedback({
        error:
          "Action interrompue. Vérifiez votre session et actualisez la page.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate method="post">
      <fieldset disabled={isSubmitting} className="min-w-0">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="cms-field">
            <label htmlFor="new-user-name">Nom complet</label>
            <input
              id="new-user-name"
              autoComplete="off"
              maxLength={120}
              {...register("name")}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "new-user-name-error" : undefined}
            />
            {errors.name && (
              <span id="new-user-name-error" className="text-red-700">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="cms-field">
            <label htmlFor="new-user-email">Adresse email</label>
            <input
              id="new-user-email"
              type="email"
              autoComplete="off"
              maxLength={254}
              {...register("email")}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? "new-user-email-error" : undefined
              }
            />
            {errors.email && (
              <span id="new-user-email-error" className="text-red-700">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="cms-field sm:col-span-2">
            <label htmlFor="new-user-role">Rôle</label>
            <select
              id="new-user-role"
              {...register("role")}
              aria-invalid={Boolean(errors.role)}
              aria-describedby="new-user-role-help"
            >
              {userRoles.map((role) => (
                <option key={role} value={role}>
                  {userRoleLabels[role]}
                </option>
              ))}
            </select>
            <span
              id="new-user-role-help"
              className="text-xs font-normal text-muted-foreground"
            >
              Client : espace personnel. Commercial : demandes de devis.
              Administrateur : gestion complète, y compris les utilisateurs.
            </span>
          </div>
          <div className="cms-field">
            <label htmlFor="new-user-password">Mot de passe</label>
            <input
              id="new-user-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              minLength={12}
              maxLength={128}
              {...register("password")}
              aria-invalid={Boolean(errors.password)}
              aria-describedby="new-user-password-help new-user-password-error"
            />
            <span id="new-user-password-help" className="text-xs font-normal">
              Entre 12 et 128 caractères.
            </span>
            <span id="new-user-password-error" className="text-red-700">
              {errors.password?.message}
            </span>
          </div>
          <div className="cms-field">
            <label htmlFor="new-user-confirm">Confirmer le mot de passe</label>
            <input
              id="new-user-confirm"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              maxLength={128}
              {...register("confirmPassword")}
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={
                errors.confirmPassword ? "new-user-confirm-error" : undefined
              }
            />
            {errors.confirmPassword && (
              <span id="new-user-confirm-error" className="text-red-700">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          className="my-4 inline-flex min-h-11 items-center gap-2 text-xs"
          aria-pressed={showPassword}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff size={16} aria-hidden="true" />
          ) : (
            <Eye size={16} aria-hidden="true" />
          )}
          {showPassword
            ? "Masquer les mots de passe"
            : "Afficher les mots de passe"}
        </button>
        <p className="muted mb-5">
          Transmettez les identifiants à la personne concernée par un canal sûr.
          Aucun email automatique n’est envoyé. Le mot de passe ne sera plus
          consultable après la création.
        </p>
        <Button type="submit" disabled={isSubmitting}>
          <UserPlus size={17} aria-hidden="true" />
          {isSubmitting ? "Création en cours…" : "Créer l’utilisateur"}
        </Button>
      </fieldset>
      {feedback.error && (
        <p role="alert" className="cms-error">
          {feedback.error}
        </p>
      )}
      {feedback.success && (
        <p role="status" className="cms-success">
          {feedback.success}
        </p>
      )}
    </form>
  );
}
