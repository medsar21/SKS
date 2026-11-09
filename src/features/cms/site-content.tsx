"use client";
import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { defaultSettings, type SiteSettings } from "./validation";
import {
  defaultReferences,
  type ReferenceContent,
} from "@/features/references/content";

const SiteContext = createContext<{
  copy: Record<string, string>;
  settings: SiteSettings;
  references: ReferenceContent;
}>({ copy: {}, settings: defaultSettings, references: defaultReferences });
export function SiteContentProvider({
  copy,
  settings,
  references = defaultReferences,
  children,
}: {
  copy: Record<string, string>;
  settings: SiteSettings;
  references?: ReferenceContent;
  children: ReactNode;
}) {
  useEffect(() => {
    document.documentElement.lang = settings.locale;
    document.documentElement.dir = settings.locale === "ar" ? "rtl" : "ltr";
    return () => {
      document.documentElement.lang = "fr";
      document.documentElement.dir = "ltr";
    };
  }, [settings.locale]);
  return (
    <SiteContext.Provider value={{ copy, settings, references }}>
      <div
        style={
          {
            "--primary": settings.primary,
            "--color-primary": settings.primary,
            "--accent": settings.accent,
            "--color-accent": settings.accent,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </SiteContext.Provider>
  );
}
export function useSiteContent(group?: string) {
  const { copy, settings, references } = useContext(SiteContext);
  return {
    t: (original: string) => copy[`${group}:${original}`] ?? original,
    settings,
    references,
  };
}
export function CopyText({ text }: { text: string }) {
  return useSiteContent().t(text);
}
export function HomeSections({ children }: { children: ReactNode }) {
  const { settings } = useSiteContent();
  const sections = Children.toArray(children).filter(
    isValidElement<{ id?: string }>,
  );
  return (
    <>
      {settings.homeSections
        .filter((s) => s.visible)
        .map((s) => sections.find((child) => child.props.id === s.id))}
    </>
  );
}
