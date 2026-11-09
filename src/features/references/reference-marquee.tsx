"use client";
import { useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { Container } from "@/components/ui/container";
import { useSiteContent } from "@/features/cms/site-content";
import styles from "./reference-marquee.module.css";

export function ReferenceMarquee({ id = "references" }: { id?: string }) {
  const { references } = useSiteContent();
  const [paused, setPaused] = useState(false);
  if (!references.logos.length) return null;
  const logos = Array.from(
    { length: Math.ceil(8 / references.logos.length) },
    () => references.logos,
  ).flat();
  return (
    <section
      id={id}
      className={styles.section}
      aria-labelledby="references-title"
    >
      <Container>
        <div className={styles.heading}>
          <div>
            <h2 id="references-title">{references.heading}</h2>
            {references.description && <p>{references.description}</p>}
          </div>
          <button
            className={styles.pause}
            type="button"
            aria-pressed={paused}
            aria-label={
              paused ? "Animer les logos" : "Mettre les logos en pause"
            }
            onClick={() => setPaused(!paused)}
          >
            {paused ? (
              <Play size={16} aria-hidden="true" />
            ) : (
              <Pause size={16} aria-hidden="true" />
            )}
            <span>{paused ? "Reprendre" : "Pause"}</span>
          </button>
        </div>
        <div className={styles.rail}>
          <div
            className={styles.track}
            style={{
              animationPlayState: paused ? "paused" : "running",
              animationDuration: `${Math.max(28, logos.length * 4)}s`,
            }}
          >
            {[0, 1].map((group) => (
              <div
                key={group}
                className={styles.group}
                aria-hidden={group === 1 ? true : undefined}
              >
                {logos.map((logo, index) => (
                  <div
                    key={`${logo.src}-${index}`}
                    className={styles.logo}
                    data-repeat={index >= references.logos.length}
                    aria-hidden={
                      index >= references.logos.length || group === 1
                        ? true
                        : undefined
                    }
                  >
                    <Image
                      src={logo.src}
                      alt={
                        group === 0 && index < references.logos.length
                          ? logo.name
                          : ""
                      }
                      width={160}
                      height={72}
                      sizes="160px"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
