export function ProductIllustration({
  kind = "panel",
  className = "",
}: {
  kind?: "panel" | "prop" | "accessory";
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 500 400"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M55 325 260 210 458 315 253 390Z"
        fill="currentColor"
        opacity=".05"
      />
      {kind === "panel" ? (
        <g stroke="currentColor" strokeWidth="5" strokeLinejoin="round">
          <path d="m115 105 160-65 100 45-160 68Z" fill="#adbac1" />
          <path d="m115 105 100 48v202l-100-52Z" fill="#6c7b85" />
          <path d="m215 153 160-68v202l-160 68Z" fill="#8798a3" />
          <path d="m232 169 126-55v151l-126 54Z" fill="#52626d" />
          <path
            d="m236 211 120-52m-120 99 120-53m-80-73v148m40-166v149m-195-126 73 35m-73 28 73 36m-73 27 73 36"
            opacity=".7"
          />
          <path
            d="m125 117 75 37v179l-75-37Z"
            stroke="#b9c4c9"
            strokeWidth="3"
          />
        </g>
      ) : kind === "prop" ? (
        <g stroke="currentColor" strokeWidth="5" strokeLinejoin="round">
          <path d="m195 331 65-28 62 25-64 30Z" fill="#83919a" />
          <path d="m247 142 19-8v197l-19 8Z" fill="#7b8b96" />
          <path d="m251 70 11-5v98l-11 5Z" fill="#bcc6cb" />
          <path d="m221 71 40-17 39 17-40 17Z" fill="#99a7b0" />
          <path d="m235 184 43-18v30l-43 18Z" fill="var(--accent)" />
          <path d="m219 210 74-32" strokeWidth="9" />
        </g>
      ) : (
        <g stroke="currentColor" strokeWidth="6" strokeLinejoin="round">
          <path d="m145 215 105-47 102 47-105 48Z" fill="#98a6af" />
          <path d="m145 215v46l102 47v-45m0 45 105-47v-46" fill="#6b7c86" />
          <path
            d="m194 193v-57l52-23 49 23v57l-26 12v-55l-23-11-26 11v55Z"
            fill="#879aa6"
          />
          <path d="m194 241 53-24 52 24-52 24Z" fill="var(--accent)" />
        </g>
      )}
    </svg>
  );
}
