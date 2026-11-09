import Image from "next/image";
import { useId } from "react";

export const DEFAULT_LOGO = "/images/sks-projets-logo.png";

export function BrandLogo({
  src = DEFAULT_LOGO,
  alt = "SKS PROJETS",
  preload = false,
  onDark = false,
}: {
  src?: string;
  alt?: string;
  preload?: boolean;
  onDark?: boolean;
}) {
  const filterId = `brand-dark-${useId().replace(/:/g, "")}`;
  const logo = src === "/images/sks-logo.png" ? DEFAULT_LOGO : src;
  const original = logo === DEFAULT_LOGO;
  return (
    <span
      className={original ? "brand-logo brand-logo-original" : "brand-logo"}
    >
      {onDark && (
        <svg
          width="0"
          height="0"
          aria-hidden="true"
          focusable="false"
          style={{ position: "absolute" }}
        >
          <defs>
            <filter id={filterId} colorInterpolationFilters="sRGB">
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 -0.27843 0 0 0 1 -0.8902 0 0 0 1 0 0 0 1 0"
              />
            </filter>
          </defs>
        </svg>
      )}
      <Image
        src={logo}
        alt={alt}
        width={original ? 4163 : 150}
        height={original ? 2584 : 65}
        sizes={original ? "260px" : "160px"}
        className="brand-logo-image"
        style={onDark ? { filter: `url(#${filterId})` } : undefined}
        preload={preload}
      />
    </span>
  );
}
