"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type Turnstile = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

export function TurnstileWidget({
  onToken,
}: {
  onToken: (token: string) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const api = window.turnstile;
    if (!ready || !container.current || !api) return;
    const id = api.render(container.current, {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
      action: "login",
      language: "fr",
      theme: "light",
      size: "flexible",
      callback: (token: string) => {
        setFailed(false);
        onToken(token);
      },
      "expired-callback": () => onToken(""),
      "error-callback": () => {
        onToken("");
        setFailed(true);
      },
    });
    return () => {
      api.remove(id);
    };
  }, [ready, onToken]);
  return (
    <div className="my-5">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        onReady={() => setReady(true)}
        onError={() => setFailed(true)}
      />
      <div ref={container} />
      {failed && (
        <p role="alert">
          La vérification anti-robot est indisponible. Rechargez la page pour
          réessayer.
        </p>
      )}
    </div>
  );
}
