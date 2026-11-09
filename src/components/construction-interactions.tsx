"use client";

import { useEffect, useRef } from "react";
import styles from "./construction-interactions.module.css";

const controls = 'a[href], button, summary, [role="button"]';

export function ConstructionInteractions() {
  const cursorRef = useRef<HTMLSpanElement>(null);
  const effectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const effects = effectsRef.current;
    if (!cursor || !effects) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const hide = () => {
      cursor.style.opacity = "0";
    };
    const move = (event: PointerEvent) => {
      if (
        reduced.matches ||
        !finePointer.matches ||
        event.pointerType !== "mouse"
      ) {
        hide();
        return;
      }
      const target = event.target;
      if (
        !(target instanceof Element) ||
        target.closest('input, textarea, select, [contenteditable="true"]')
      ) {
        hide();
        return;
      }
      cursor.style.transform = `translate3d(${event.clientX + 16}px, ${event.clientY + 18}px, 0)`;
      cursor.style.opacity = "1";
      cursor.dataset.interactive = String(Boolean(target.closest(controls)));
    };
    const click = (event: MouseEvent) => {
      if (reduced.matches || !(event.target instanceof Element)) return;
      const control = event.target.closest(controls);
      if (!control || control.matches(':disabled, [aria-disabled="true"]'))
        return;
      const bounds = control.getBoundingClientRect();
      const ring = document.createElement("span");
      ring.className = styles.ring ?? "";
      ring.style.left = `${event.detail === 0 ? bounds.x + bounds.width / 2 : event.clientX}px`;
      ring.style.top = `${event.detail === 0 ? bounds.y + bounds.height / 2 : event.clientY}px`;
      if (effects.childElementCount >= 8) effects.firstElementChild?.remove();
      effects.append(ring);
      ring.addEventListener("animationend", () => ring.remove(), {
        once: true,
      });
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", hide);
    document.addEventListener("click", click);
    window.addEventListener("blur", hide);
    reduced.addEventListener("change", hide);
    finePointer.addEventListener("change", hide);
    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", hide);
      document.removeEventListener("click", click);
      window.removeEventListener("blur", hide);
      reduced.removeEventListener("change", hide);
      finePointer.removeEventListener("change", hide);
      effects.replaceChildren();
    };
  }, []);

  return (
    <div className={styles.effects} aria-hidden="true">
      <span ref={cursorRef} className={styles.cursor}>
        👷
      </span>
      <div ref={effectsRef} />
    </div>
  );
}
