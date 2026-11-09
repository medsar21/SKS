"use client";

import { BrandLogo, DEFAULT_LOGO } from "@/components/brand-logo";
import { useSiteContent } from "@/features/cms/site-content";

const labels = {
  fr: "Chargement de votre espace…",
  ar: "جارٍ تحميل مساحتك…",
  en: "Loading your space…",
};

export function BrandLoading({ intro = false }: { intro?: boolean }) {
  const { settings } = useSiteContent();
  return (
    <div
      className={`brand-loading${intro ? " brand-loading-intro" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={labels[settings.locale]}
    >
      <div className="brand-loading-content">
        <div className="brand-loading-emblem" aria-hidden="true">
          <BrandLogo src={settings.logo || DEFAULT_LOGO} alt="" preload />
        </div>
        <div className="brand-loading-road" aria-hidden="true">
          <div className="brand-loading-runway">
            <div className="brand-loading-vehicle">
              <svg viewBox="0 0 80 52" width="72" height="47" fill="none">
                <g className="brand-loading-chassis">
                  <path
                    d="M21 31V13h23l7 18M25 13V8h23"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                  <path d="M28 17h12l4 13H28z" fill="#a9d4e4" />
                  <path d="M13 28h43v13H13z" fill="currentColor" />
                  <path
                    d="m49 32 15 8m-1-16v19h12"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinejoin="round"
                  />
                  <path d="M17 24v-8" stroke="currentColor" strokeWidth="3" />
                </g>
                <rect
                  x="9"
                  y="35"
                  width="48"
                  height="14"
                  rx="7"
                  fill="#101d2e"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                {[18, 29, 40, 49].map((x) => (
                  <g
                    key={x}
                    className="brand-loading-wheel"
                    style={{ transformOrigin: `${x}px 42px` }}
                  >
                    <circle
                      cx={x}
                      cy="42"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path d={`M${x} 38v8`} stroke="currentColor" />
                  </g>
                ))}
              </svg>
            </div>
          </div>
          <div className="brand-loading-track" />
        </div>
        <p>{labels[settings.locale]}</p>
        <span className="brand-loading-caption" aria-hidden="true">
          SKS PROJETS
        </span>
      </div>
    </div>
  );
}
