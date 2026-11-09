"use client";
import { useState, useTransition, type FormEvent } from "react";
import { updateQuoteStatus } from "@/server/quote-actions";
import { transitions, statusLabels, type QuoteState } from "./validation";
import { Button } from "@/components/ui/button";

export function StatusForm({ id, status }: { id: string; status: QuoteState }) {
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const to = new FormData(event.currentTarget).get("to");
    startTransition(async () => {
      try {
        const result = await updateQuoteStatus({ id, from: status, to });
        setMessage(result.error ?? "Statut mis à jour.");
      } catch {
        setMessage(
          "Modification interrompue. Actualisez la page et vérifiez votre connexion.",
        );
      }
    });
  }
  return (
    <div className="my-6">
      <p>
        Statut : <strong>{statusLabels[status]}</strong>
      </p>
      {transitions[status].length > 0 ? (
        <form onSubmit={submit} className="mt-4 flex flex-wrap items-end gap-4">
          <label>
            Nouveau statut
            <select className="form-field" name="to" disabled={pending}>
              {transitions[status].map((value) => (
                <option key={value} value={value}>
                  {statusLabels[value]}
                </option>
              ))}
            </select>
          </label>
          <Button disabled={pending} type="submit">
            {pending ? "Modification…" : "Modifier le statut"}
          </Button>
        </form>
      ) : (
        <p className="muted mt-3">Ce statut est définitif.</p>
      )}
      <p role="status" className="mt-3">
        {message}
      </p>
    </div>
  );
}
