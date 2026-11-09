"use client";
import { useLayoutEffect, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  useLayoutEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (pathname.startsWith("/admin") || window.location.hash) return;
    const reset = () =>
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    reset();
    const frame = requestAnimationFrame(reset);
    return () => cancelAnimationFrame(frame);
  }, [pathname]);
  useEffect(() => {
    function resetCurrentPage(event: MouseEvent) {
      if (window.location.pathname.startsWith("/admin")) return;
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor =
        event.target instanceof Element ? event.target.closest("a") : null;
      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      )
        return;
      const url = new URL(anchor.href, window.location.href);
      if (
        url.origin === window.location.origin &&
        url.pathname === window.location.pathname &&
        !url.hash
      )
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    document.addEventListener("click", resetCurrentPage);
    return () => document.removeEventListener("click", resetCurrentPage);
  }, []);
  return null;
}
